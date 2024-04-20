// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { Kafka } from "https://deno.land/x/kafkajs/mod.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
const kafkaBrokers = ["your-kafka-broker:9092"];
const kafkaTopic = "your-kafka-topic";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const kafka = new Kafka({ brokers: kafkaBrokers });
const producer = kafka.producer();

export const handler = async (req) => {
  try {
    // Extract projectId from request body
    const { projectId } = await req.json();

    // Fetch corresponding job from jobs table in Supabase
    const { data: job, error: supabaseError } = await supabase
      .from('jobs')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (supabaseError || !job) {
      throw new Error('Job not found');
    }

    // Produce Kafka event
    await producer.send({
      topic: kafkaTopic,
      messages: [{ value: JSON.stringify(job) }],
    });

    // Close Kafka producer
    await producer.disconnect();

    return new Response(
      JSON.stringify({ message: 'Event produced successfully' }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ message: 'Error producing event' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/start-process' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
