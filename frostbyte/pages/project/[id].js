import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Space_Grotesk } from "@next/font/google"

import ProjectDetails from "../../components/ProjectDetails";
import Guide from "../../components/Guide";
import Tasks from "../../components/Tasks";

const space = Space_Grotesk({ subsets: ["latin"] })

export default function Project({ project, tasks, buckets }) {
  const supabaseClient = useSupabaseClient()
  
  const [view, setView] = useState("details")

  const menu = [
    { label: "Details", name: "details" },
    { label: "Tasks", name: "tasks" },
  ]

  return (
    <div className="bg-zinc-800">
      <div className="max-w-[800px] mx-auto px-10 pt-4">
        <div className="flex justify-start items-end pb-4 px-2">
          <h2 className={`${space.className} text-3xl text-zinc-200 mr-10`}>
            {project.name}
          </h2>
          {menu.map(menu => (
            <div key={menu.name} className={`${menu.name === view ? "bg-zinc-700 " : ""} cursor-default py-1 px-4 mr-4 text-zinc-300 font-light rounded text-sm hover:bg-zinc-600 duration-150`}
              onClick={() => setView(menu.name)}
            >
              {menu.label}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 min-h-[calc(100vh-122px)] ">
        <div className="max-w-[800px] mx-auto px-10 py-5">
          { view === "details" && (
            <>
              <ProjectDetails project={project} />
              <Guide project={project} />
            </>
          )}
          { view === "tasks" && (<Tasks tasks={tasks} buckets={buckets} />)}
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
  const p2 = supabase.from("tasks").select("id, name, source_bucket, destination_bucket, spec").eq("project_id", ctx.params.id)
  const p3 = supabase.functions.invoke("get-buckets", {
    body: { projectId: ctx.params.id }
  })

  const [project, tasks, buckets] = await Promise.all([p1, p2, p3])
  
  return {
    props: {
      project: project.data[0], tasks: tasks.data, buckets: JSON.parse(buckets.data).buckets
    }
  }
}

