import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { decode as hd } from "https://deno.land/std/encoding/hex.ts";

// Frostbyte supabase client
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
)

serve(async (req) => {
  const te=(s:string)=>new TextEncoder().encode(s),
        td=(d:Uint8Array)=>new TextDecoder().decode(d);

  const apiKey = req.headers.get("api-key")
  const { bucket_id, filename, task_id } = await req.json()

  // Fetch project details
  const { data, error } = await supabaseClient
    .from("projects")
    .select("id, name, supabase_url, supabase_secret, iv")
    .eq("api_key", apiKey)

  if (error) {
    console.error("Supabase query error: ", error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }

  if (!data.length) {
    return new Response("Unauthorized.", {
      status: 401
    })
  }

  // Decrypt secret key
  const key = await crypto.subtle.importKey(
    "raw",
    hd(te(Deno.env.get("AES_KEY"))).buffer,
    "AES-CBC",
    true,
    ["encrypt", "decrypt"],
  );

  const iv = hd(te(data[0].iv))

  const decrypted = await crypto.subtle.decrypt(
    {name: "AES-CBC", iv},
    key,
    hd(te(data[0].supabase_secret)),
  );

  const decryptedBytes = new Uint8Array(decrypted);
  const secretKey = td(decryptedBytes);

  // Get public URL for uploaded object
  const client = createClient(data[0].supabase_url, secretKey)    // Supabase client with user's project admin privileges
  const { data: signedUrl } = await client
    .storage
    .from(bucket_id)
    .createSignedUrl(filename, 86400)

  console.log(signedUrl)

  return new Response(
    JSON.stringify({
      secretKey, signedUrl
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})



// Deployment manual:
// 1. Ensure pg_net extension is enabled
// 2. Add postgres function and trigger
