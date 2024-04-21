import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export const POST = async (req: Request, res: Response) => {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
  }

  if (!user) {
    return new NextResponse(JSON.stringify({
      error: "Not authorized"
    }), { status: 403 })
  }

  const { name, supabaseUrl, supabaseKey } = await req.json()

  if (
    !name ||
    !supabaseUrl ||
    !supabaseKey ||
    !name.trim() ||
    !supabaseUrl.trim() ||
    !supabaseKey.trim()
  ) {
    return new NextResponse(JSON.stringify({
      error: "Please provide all project details"
    }), { status: 400 })
  }

  const projectAPIKey = "sk_" + randomBytes(32).toString("hex")

  // Supabase RPC call to insert_supabase_project
  const { data, error: rpcError } = await supabase.rpc("insert_supabase_project", {
    project_name: name,
    supabase_url: supabaseUrl,
    supabase_secret: supabaseKey,
    api_key: projectAPIKey,
    user_id: user.id,
  })
  if (rpcError) {
    console.error(rpcError)
    return new NextResponse(JSON.stringify({ error: rpcError.message }), { status: 500 })
  }

  return new NextResponse(JSON.stringify({
    projectId: data
  }), { status: 200 })
}
