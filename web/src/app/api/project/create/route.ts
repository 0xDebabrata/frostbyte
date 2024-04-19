import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  // TODO: Add authentication
  const userId = "test"

  const { name, supabaseUrl, supabaseKey } = await req.json()

  if (!name.trim() || !supabaseUrl.trim() || !supabaseKey.trim()) {
    return new NextResponse(JSON.stringify({
      error: "Please provide all project details"
    }), { status: 400 })
  }

  const projectAPIKey = "sk_" + randomBytes(32).toString("hex")
  console.log({ name, supabaseKey, supabaseUrl, apiKey: projectAPIKey })

  // Supabase RPC call to insert_supabase_project

  return new NextResponse("ok", { status: 200 })
}
