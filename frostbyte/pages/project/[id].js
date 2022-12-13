import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function Project({ project, tasks }) {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  console.log(project)
  console.log(tasks)
  return (
    <div className="bg-zinc-800 min-h-[calc(100vh-54px)] ">
      Hello world
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const { data: { session }} = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const p1 = supabase.from("projects").select("id, name, api_key, supabase_url").eq("id", ctx.params.id)
  const p2 = supabase.from("tasks").select("id, source_bucket, destination_bucket, spec").eq("project_id", ctx.params.id)

  const [project, tasks] = await Promise.all([p1, p2])
  
  return {
    props: {
      project, tasks
    }
  }
}

