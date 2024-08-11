// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.24.0'

const frostbyteOutputPrefix = "frostbyte_output_"

Deno.serve(async (req) => {
  const apiKey = req.headers.get('x-frostbyte-api-key')!
  const url = new URL(req.url)
  const jobId = url.searchParams.get("job_id")

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const p1 = supabaseClient
    .from("decrypted_api_keys")
    .select("project_id")
    .eq("decrypted_api_key", apiKey)
  const p2 = supabaseClient
    .from("jobs")
    .select("*")
    .eq("id", jobId)

  const [apiKeyResult, jobResult] = await Promise.allSettled([p1, p2])

  if (apiKeyResult.status === "rejected") {
    console.error(apiKeyResult.reason)
    return new Response(
      JSON.stringify({ error: apiKeyResult.reason }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    )
  } else if (jobResult.status === "rejected") {
    console.error(jobResult.reason)
    return new Response(
      JSON.stringify({ error: jobResult.reason }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    )
  }

  const { data: apiKeyData } = apiKeyResult.value
  let { data: jobData } = jobResult.value

  if (!apiKeyData || !apiKeyData.length) {
    console.log("Invalid API Key")
    return new Response(
      JSON.stringify({ error: "Invalid API Key" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    )
  }
  if (!jobData || !jobData.length) {
    console.log("Invalid job ID")
    return new Response(
      JSON.stringify({ error: "Invalid job ID" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    )
  }
  if (apiKeyData[0].project_id !== jobData[0].project_id) {
    console.log("API Key project ID and job ID mismatch")
    return new Response(
      JSON.stringify({ error: "Invalid API Key" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    )
  }

  const data = await req.json()
  jobData = jobData[0]

  let job = {
    Version: jobData.version,
    Id: jobData.id,
    UserId: jobData.user_id,
    ProjectId: jobData.project_id,
    InputBucketId: jobData.input_bucket,
    ObjectName: data.record.name,
    OutputBucketId: jobData.output_bucket,
    VideoCodec: jobData.format.toLowerCase(),
    Resolution: jobData.resolution.toLowerCase(),
    Quality: jobData.quality.toLowerCase(),
    ReceivedAt: (new Date()).toISOString(),
    ProcessedAt: 0,
    LogId: 0,
  }

  // Ignore files larger than 50MB
  if (data.record.metadata.size > 25000000) {
    console.log("Ignoring large file", data.record.metadata.size)
    await supabaseClient
      .from("logs")
      .insert({
        status: "failed",
        job_id: jobData.id,
        project_id: jobData.project_id,
        user_id: jobData.user_id,
        metadata: job,
        message: "File sizes larger than 25MB not allowed."
      })
    return new Response(
      JSON.stringify({ error: "File sizes larger than 25MB not allowed." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 469,
      },
    )
    // Ignore non-video files
  } else if (!data.record.metadata.mimetype.startsWith("video")) {
    console.log("Ignoring non-video file", data.record.metadata.mimetype)
    await supabaseClient
      .from("logs")
      .insert({
        status: "failed",
        job_id: jobData.id,
        project_id: jobData.project_id,
        user_id: jobData.user_id,
        metadata: job,
        message: `Ignoring non-video file: ${data.record.metadata.mimetype} mimetype.`
      })
    return new Response(
      JSON.stringify({ error: "Ignoring non-video file" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 469,
      },
    )
    // Ignore if inserted file is actually the output from frostbyte.
    // If input and output buckets are same, this prevents recursion.
  } else if (data.record.name.startsWith(frostbyteOutputPrefix)) {
    return new Response(
      JSON.stringify({ message: "Possible recursion" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    )
    // Ignore if job input bucket is different from the bucket the object was uploaded to
  } else if (data.record.bucket_id !== jobData.input_bucket) {
    return new Response(
      JSON.stringify({ error: "Job ID and file upload bucket does not match" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 469,
      },
    )
  }

  // Add to logs
  const { data: logData } = await supabaseClient
    .from("logs")
    .insert({
      status: "queued",
      job_id: jobData.id,
      project_id: jobData.project_id,
      user_id: jobData.user_id,
      metadata: job,
    })
    .select("id")
  const logId = logData[0].id
  job.LogId = logId

  // Push event to kafka
  await fetch(`${Deno.env.get("KAFKA_ADDRESS")}/produce/jobs/${JSON.stringify(job)}`, {
    headers: {
      Authorization: `Basic ${Deno.env.get("UPSTASH_AUTHORIZATION")}`
    }
  })
  console.log("Event pushed to Kafka")

  return new Response(
    JSON.stringify({ message: 'Event pushed to Kafka successfully' }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/start-process' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

