// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import {Kafkasaur} from "https://deno.land/x/kafkasaur/index.ts"
import { createClient } from "@supabase/supabase-js";
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

  const { job_id } = await req.json()

  console.log("User", user)
  console.log("Project ID", job_id)

  const { data: job, error: sqlError } = await supabaseClient
    .from('jobs')
    .select('*')
    .eq("job_id", parseInt(job_id))
    .single()

  if (sqlError || !job) {
    console.error(sqlError)
    return new Response(
      JSON.stringify({ error: sqlError }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    )
  }

  const kafka = new Kafkasaur({
    clientId: 'example-producer',
    brokers: ['localhost:9092']
  })
   
  const producer = kafka.producer();

  try {
    await producer.send({
      topic: kafka,
      messages: [{ value: JSON.stringify(job) }],
    });

    return new Response(
      JSON.stringify({ message:'Event pushed to Kafka successfully' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
}
catch(error){
  console.error('Error pushing event to Kafka:', error);
  return new Response(
    JSON.stringify({ error: sqlError }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    },
  )
}
})



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/start-process' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
