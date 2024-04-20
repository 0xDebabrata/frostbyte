import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";

export const POST = async (req: Request, res: Response) => {
  const supabase = createClient()
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  )

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

  const {
    inputBucket,
    outputBucket,
    outputFormat,
    outputResolution,
    outputQuality,
    projectId,
  } = await req.json()

  if (
    !inputBucket ||
    !outputBucket ||
    !outputFormat ||
    !outputResolution ||
    !outputQuality ||
    !projectId ||
    !inputBucket.trim() ||
    !outputBucket.trim() ||
    !outputFormat.trim() ||
    !outputResolution.trim() ||
    !outputQuality.trim()
  ) {
    return new NextResponse(JSON.stringify({
      error: "Please provide all project details"
    }), { status: 400 })
  }

  const jobId = "job_" + randomBytes(4).toString("hex")
  const { error: insertError } = await supabaseAdmin
    .from("jobs")
    .insert({
      id: jobId,
      project_id: projectId,
      input_bucket: inputBucket,
      output_bucket: outputBucket,
      format: outputFormat,
      resolution: outputResolution,
      quality: outputQuality,
      user_id: user.id,
    })

  if (insertError) {
    console.error(insertError)
    return new NextResponse(JSON.stringify({ error: insertError.message }), { status: 500 })
  }

  return new NextResponse(JSON.stringify({
    jobId
  }), { status: 200 })
}
