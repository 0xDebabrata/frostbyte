import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function Project({ project, tasks }) {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const menu = [
    { label: "Details", name: "details", active: true },
    { label: "Tasks", name: "tasks", active: false },
  ]

  return (
    <div className="bg-zinc-800">
      <div className="max-w-[800px] mx-auto px-10 pt-4">
        <div className="flex justify-start items-end pb-4 px-2">
          <h2 className="text-3xl text-zinc-200 mr-10">
            {project.name}
          </h2>
          {menu.map(menu => (
            <div key={menu.name} className={`${menu.active ? "bg-zinc-700 " : ""} cursor-default py-1 px-4 mr-4 text-zinc-300 font-light rounded text-sm hover:bg-zinc-600 duration-150`}>
              {menu.label}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 min-h-[calc(100vh-122px)] ">
        <div className="max-w-[800px] mx-auto px-10 pt-5">
          <div className="py-5 px-10 flex flex-col sm:flex-row items-start w-full bg-zinc-800 rounded">
            <p className="w-[40%] text-zinc-200 text-sm pb-5 sm:pt-1">
              General settings
            </p>
            <div className="w-full">
              <label className="text-zinc-400 font-light text-sm">Project ID</label>
              <input type='text' 
                className="px-2 py-1 text-sm cursor-default w-full mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none focus:border-zinc-500"
                value={project.id}
                readOnly
                /> 
              <label className="text-zinc-400 font-light text-sm">Project Name</label>
              <input type='text' 
                className="px-2 py-1 text-sm cursor-default w-full mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none focus:border-zinc-500"
                value={project.name}
                readOnly
                /> 
              <label className="text-zinc-400 font-light text-sm">Frostbyte API Key</label>
              <input type='text' 
                className="px-2 py-1 text-sm cursor-default w-full mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none focus:border-zinc-500"
                value={project.api_key}
                readOnly
                /> 
            </div>
          </div>
        </div>
      </div>
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
      project: project.data[0], tasks: tasks.data
    }
  }
}

