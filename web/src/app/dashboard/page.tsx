'use client'

import { useEffect, useState } from "react"

import { Database } from "@/utils/supabase"
import CreateProjectModal from "@/components/Modal/CreateProjectModal"

export default function Dashboard() {
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<Database["public"]["Tables"]["supabase_projects"]["Row"][]>([])

  const fetchProjects = async () => {
    const currDate = new Date()
    setProjects([
      {
        id: 1,
        connected_at: currDate.toLocaleDateString(),
        supabase_url: "",
        supabase_secret_key: "",
        name: "frostbyte",
        key_id: "",
        user_id: "",
      },
      {
        id: 2,
        connected_at: currDate.toLocaleDateString(),
        supabase_url: "",
        supabase_secret_key: "",
        name: "just ice",
        key_id: "",
        user_id: "",
      }
    ])
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="p-10 lg:p-24 min-h-screen bg-gradient-to-b from-neutral-800 to-zinc-900">
      <h1 className="font-mono text-3xl">
        Projects
      </h1>
      <button
        onClick={() => setOpen(true)}
        className="mt-5 rounded py-1 px-3 bg-teal-700 border border-teal-500 text-white text-xs"
      >
        New project
      </button>
      <div className="pt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 pb-10 rounded border border-neutral-700 bg-neutral-800 cursor-pointer hover:bg-stone-800 duration-200"
          >
            <p className="font-light text-neutral-100 pb-2">{project.name}</p>
            <p className="font-light text-sm text-neutral-400">Created at: {project.connected_at}</p>
          </div>
        ))}
      </div>
      <CreateProjectModal open={open} setOpen={setOpen} />
    </div>
  )
}
