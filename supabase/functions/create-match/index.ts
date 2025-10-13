import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { checkRateLimit } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: 20 match checks per hour per user
    const rateLimit = checkRateLimit(user.id, {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000,
      keyPrefix: 'create-match'
    });

    if (rateLimit.isLimited) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter)
          } 
        }
      );
    }

    const { petId, swipeDirection } = await req.json();

    if (!petId || !swipeDirection) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: petId, swipeDirection' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only check for matches on right swipes or super likes
    if (swipeDirection !== 'right' && swipeDirection !== 'super') {
      return new Response(
        JSON.stringify({ matched: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get pet owner_id (server-side only)
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('owner_id')
      .eq('id', petId)
      .single();

    if (petError || !pet) {
      console.error('Pet not found:', petError);
      return new Response(
        JSON.stringify({ error: 'Pet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for reciprocal right swipe from pet owner
    const { data: reciprocalSwipe, error: swipeError } = await supabase
      .from('swipes')
      .select('created_at')
      .eq('swiper_id', pet.owner_id)
      .eq('swiped_id', user.id)
      .eq('swiped_type', 'user')
      .eq('swipe_direction', 'right')
      .maybeSingle();

    if (swipeError) {
      console.error('Error checking reciprocal swipe:', swipeError);
      return new Response(
        JSON.stringify({ error: 'Failed to check reciprocal swipe' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No reciprocal swipe found
    if (!reciprocalSwipe) {
      return new Response(
        JSON.stringify({ matched: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify swipe timestamps are reasonable (not both instant)
    const reciprocalSwipeTime = new Date(reciprocalSwipe.created_at).getTime();
    const now = Date.now();
    const timeDiff = now - reciprocalSwipeTime;
    
    // Swipes should be at least 1 second apart to be legitimate
    if (timeDiff < 1000) {
      console.warn('Suspicious match timing detected', { userId: user.id, petId, timeDiff });
      return new Response(
        JSON.stringify({ matched: false, reason: 'Invalid timing' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if match already exists
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('user1_id', user.id)
      .eq('user2_id', pet.owner_id)
      .eq('pet_id', petId)
      .eq('match_type', 'user_pet')
      .maybeSingle();

    if (existingMatch) {
      return new Response(
        JSON.stringify({ matched: true, alreadyMatched: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create match atomically
    const { error: matchError } = await supabase
      .from('matches')
      .insert({
        user1_id: user.id,
        user2_id: pet.owner_id,
        pet_id: petId,
        match_type: 'user_pet'
      });

    if (matchError) {
      console.error('Error creating match:', matchError);
      return new Response(
        JSON.stringify({ error: 'Failed to create match' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Match created successfully', { userId: user.id, ownerId: pet.owner_id, petId });

    return new Response(
      JSON.stringify({ matched: true, alreadyMatched: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-match function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
