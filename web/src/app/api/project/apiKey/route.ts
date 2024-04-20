import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@/utils/supabase/admin";

export const GET = async (req: Request, res: Response) => {
  const supabase = createClient()
  const supabaseAdmin = createAdminClient()

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

  const url = new URL(req.url)
  const projectId = url.searchParams.get("projectId")

  if (!projectId) {
    return new NextResponse(JSON.stringify({
      error: "Please provide a project ID"
    }), { status: 400 })
  }

  const { data, error: adminError } = await supabaseAdmin
    .from("decrypted_api_keys")
    .select("decrypted_api_key")
    .eq("project_id", projectId)
    .eq("user_id", user.id)

  if (adminError) {
    console.error(adminError)
    return new NextResponse(JSON.stringify({ error: adminError.message }), { status: 500 })
  }

  return new NextResponse(JSON.stringify({
    apiKey: data[0].decrypted_api_key
  }), { status: 200 })
}
