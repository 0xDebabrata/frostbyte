// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.24.0'
import { corsHeaders } from "../_shared/cors.ts"

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) {
    // User not authenticated
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403
      },
    )
  }

  const { projectId } = await req.json()

  const { data: projectDetails, error: sqlError } = await supabaseClient
    .from('decrypted_supabase_projects')
    .select('supabase_url, decrypted_supabase_secret_key')
    .eq("id", parseInt(projectId))
    .eq("user_id", user.id)

  if (sqlError) {
    console.error(sqlError)
    return new Response(
      JSON.stringify({ error: sqlError }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    )
  }

  const { supabase_url, decrypted_supabase_secret_key } = projectDetails[0]
  const thirdPartySupabaseClient = createClient(
    supabase_url,
    decrypted_supabase_secret_key,
  )
  let { data: buckets, error: storageError } = await thirdPartySupabaseClient
    .storage
    .listBuckets()

  if (storageError) {
    console.error(storageError)
    return new Response(
      JSON.stringify({ error: storageError }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    )
  }

  return new Response(
    JSON.stringify({ buckets }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
