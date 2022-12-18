import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { decode as hd } from "https://deno.land/std/encoding/hex.ts";

serve(async (req) => {
  const te=(s:string)=>new TextEncoder().encode(s),
        td=(d:Uint8Array)=>new TextDecoder().decode(d);

  const { projectId } = await req.json()

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data, error } = await supabaseClient.from('projects').select('supabase_url, supabase_secret, iv').eq("id", projectId)
    if (error) throw error

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
    const { data: buckets } = await client
      .storage
      .listBuckets()

    return new Response(JSON.stringify({ buckets }), {
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }
})
