import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", 
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "German Shorthaired Pointer",
  "Yorkshire Terrier", "Boxer", "Dachshund", "Siberian Husky", "Great Dane",
  "Doberman Pinscher", "Australian Shepherd", "Miniature Schnauzer", "Cavalier King Charles Spaniel",
  "Shih Tzu", "Boston Terrier", "Pomeranian", "Havanese", "Shetland Sheepdog",
  "Brittany", "Pembroke Welsh Corgi", "Australian Cattle Dog", "English Springer Spaniel",
  "Cocker Spaniel", "Border Collie", "Vizsla"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Abyssinian", "Birman", "Oriental Shorthair", "Sphynx", "Devon Rex",
  "American Shorthair", "Scottish Fold", "Exotic Shorthair", "Burmese",
  "Himalayan", "Bengal", "Russian Blue", "Norwegian Forest Cat", "Manx",
  "Cornish Rex", "Selkirk Rex", "Turkish Angora", "Somali", "Tonkinese",
  "Chartreux", "Balinese", "Siberian", "American Curl", "Ragamuffin", "Munchkin"
];

const US_CITIES = [
  { city: "New York", state: "NY", lat: 40.7128, lng: -74.0060 },
  { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
  { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
  { city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.0740 },
  { city: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },
  { city: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936 },
  { city: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611 },
  { city: "Dallas", state: "TX", lat: 32.7767, lng: -96.7970 },
  { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  { city: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557 },
  { city: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308 },
  { city: "Columbus", state: "OH", lat: 39.9612, lng: -82.9988 },
  { city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431 },
  { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
  { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
  { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
  { city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
  { city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784 },
  { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Check if user is admin
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (!roles?.some(r => r.role === "admin")) {
      throw new Error("Admin access required");
    }

    const { count, batchSize = 10 } = await req.json();
    const targetCount = Math.min(count || 50, 100); // Limit to 100 per request for safety

    console.log(`Generating ${targetCount} pet listings...`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const generatedPets = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < targetCount; i++) {
      try {
        const species = Math.random() > 0.5 ? "dog" : "cat";
        const breeds = species === "dog" ? DOG_BREEDS : CAT_BREEDS;
        const breed = breeds[Math.floor(Math.random() * breeds.length)];
        const gender = Math.random() > 0.5 ? "male" : "female";
        const location = US_CITIES[Math.floor(Math.random() * US_CITIES.length)];
        const ageMonths = Math.floor(Math.random() * 24) + 2;
        const size = species === "dog" 
          ? ["small", "medium", "large"][Math.floor(Math.random() * 3)]
          : "small";

        // Generate pet name
        const names = species === "dog"
          ? ["Max", "Bella", "Charlie", "Luna", "Cooper", "Lucy", "Rocky", "Daisy", "Duke", "Sadie"]
          : ["Oliver", "Luna", "Leo", "Bella", "Milo", "Chloe", "Simba", "Lily", "Felix", "Sophie"];
        const name = names[Math.floor(Math.random() * names.length)];

        // Generate image using Lovable AI
        console.log(`Generating image for ${name} (${breed})...`);
        const imagePrompt = `A professional, high-quality photo of a cute ${gender} ${breed} ${species}, well-groomed, friendly expression, natural lighting, studio portrait style, 16:9 aspect ratio`;
        
        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: imagePrompt
              }
            ],
            modalities: ["image", "text"]
          })
        });

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`Image generation failed for ${name}:`, imageResponse.status, errorText);
          failCount++;
          continue;
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          console.error(`No image URL returned for ${name}`);
          failCount++;
          continue;
        }

        // Generate description using AI
        const descPrompt = `Write a friendly, professional 2-3 sentence description for a ${breed} ${species} named ${name} who is ${ageMonths} months old and ${gender}. Include personality traits and why they'd make a great pet. Keep it concise and appealing.`;
        
        const descResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "You write concise, friendly pet descriptions for adoption listings."
              },
              {
                role: "user",
                content: descPrompt
              }
            ]
          })
        });

        const descData = await descResponse.json();
        const description = descData.choices?.[0]?.message?.content || 
          `${name} is a wonderful ${breed} looking for a loving home!`;

        // Calculate price based on breed and age
        const basePrice = species === "dog" ? 800 : 400;
        const breedMultiplier = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
        const price = Math.round(basePrice * breedMultiplier);

        const petData = {
          owner_id: user.id,
          name,
          species,
          breed,
          gender,
          size,
          description,
          listing_type: "available",
          age_months: ageMonths,
          price,
          vaccinated: Math.random() > 0.3,
          available: true,
          image_url: imageUrl,
          city: location.city,
          state: location.state,
          latitude: location.lat,
          longitude: location.lng,
          delivery_method: Math.random() > 0.5 ? "pickup" : "shipping",
          listing_fee_paid: true,
          breeder_earnings_percentage: price >= 751 ? 85 : price >= 301 ? 60 : 50
        };

        // Insert into database
        const { error: insertError } = await supabaseAdmin
          .from("pets")
          .insert(petData);

        if (insertError) {
          console.error(`Failed to insert ${name}:`, insertError);
          failCount++;
          continue;
        }

        generatedPets.push({ name, breed, species });
        successCount++;
        console.log(`✓ Generated ${name} (${successCount}/${targetCount})`);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error generating pet ${i + 1}:`, error);
        failCount++;
      }
    }

    console.log(`Generation complete: ${successCount} succeeded, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        generated: successCount,
        failed: failCount,
        total: targetCount,
        pets: generatedPets
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in generate-pet-listings:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});