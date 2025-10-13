import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const { userPreferences, availablePets } = await req.json();

    // Get AI-based breed recommendations
    const systemPrompt = `You are a veterinary geneticist and pet behavior expert. Analyze pet compatibility based on:
1. Genetic health compatibility
2. Temperament and personality matching
3. Size and space requirements
4. Activity level alignment
5. Care requirements match
6. Longevity and health considerations

Provide science-based breed recommendations with compatibility scores (0-100).`;

    const userPrompt = `User Preferences:
Species: ${userPreferences.species || 'any'}
Preferred Breeds: ${userPreferences.preferredBreeds?.join(', ') || 'any'}
Lifestyle: ${userPreferences.lifestyle || 'not specified'}
Living Space: ${userPreferences.livingSpace || 'not specified'}
Experience Level: ${userPreferences.experienceLevel || 'not specified'}
Activity Level: ${userPreferences.activityLevel || 'moderate'}

Available Pets to Match:
${JSON.stringify(availablePets.slice(0, 20), null, 2)}

Analyze each pet and provide compatibility scores based on genetic health, temperament match, and lifestyle fit. Return structured data for each pet with compatibility_score (0-100), match_reasons (array of strings), and potential_concerns (array of strings).`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "score_pet_compatibility",
              description: "Score each pet's compatibility based on science and user preferences",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        pet_id: { type: "string" },
                        compatibility_score: { type: "number", minimum: 0, maximum: 100 },
                        match_reasons: { type: "array", items: { type: "string" } },
                        potential_concerns: { type: "array", items: { type: "string" } },
                        genetic_health_score: { type: "number", minimum: 0, maximum: 100 },
                        temperament_match_score: { type: "number", minimum: 0, maximum: 100 },
                        lifestyle_compatibility_score: { type: "number", minimum: 0, maximum: 100 }
                      },
                      required: ["pet_id", "compatibility_score", "match_reasons"]
                    }
                  }
                },
                required: ["recommendations"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "score_pet_compatibility" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI recommendations" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      return new Response(
        JSON.stringify({ error: "No recommendations generated" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const recommendations = JSON.parse(toolCall.function.arguments).recommendations;

    return new Response(
      JSON.stringify({ recommendations }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-breed-recommendations:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
