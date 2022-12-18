import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Unbounded } from "@next/font/google"
import Image from "next/image"

import Card from "../components/ProjectCard.js";
import Form from "../components/Forms.js";

const unbounded = Unbounded({ subsets: ["latin"] })

export default function Home({ projects: projectsSSR }) {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const [projects, setProjects] = useState(projectsSSR)

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabaseClient.from("projects").select("id, name")
      setProjects(data)
    }

    // Load projects if user is signed in but projects has not been loaded server side
    if (user && !projects) loadProjects()
  }, [user])

  if (!user && !projects) {
    return (
      <main className="bg-zinc-800 flex flex-col justify-center items-center min-h-[calc(100vh-54px)]">
        <h1 className={`${unbounded.className} text-6xl text-zinc-200 -translate-y-10`}>Frostbyte</h1>
        <h3 className="text-xl text-zinc-300 font-light mt-4 -translate-y-10">
          Crisp video transcoder and media processor for Supabase Storage.
        </h3>
          <div className="border border-green-300 rounded w-[55px] h-[52px] flex justify-center items-center hover:shadow-green-400 shadow-lg shadow-green-300 duration-150 -translate-y-5">
        <Image
          src="/supabase-logo-icon.svg"
          alt="Supabase logo"
          width={24}
          height={24}
        />
        </div>
      </main>
    );
  }

  return (
    <div className="bg-zinc-800 min-h-[calc(100vh-54px)] ">
      {(projects && projects.length === 0) && (
        <>
          <p className="text-center text-zinc-300">
            Looks like you don&apos;t have any projects yet :(
          </p>
          <p className="text-center text-zinc-300">
            Get started by connecting your Supabase project now!
          </p>
        </>
      )}

      {(projects && projects.length > 0) && (
        <div className="flex justify-center max-w-[800px] mx-auto px-10">
          {projects.map((project, idx) => {
            return (
              <Card key={idx} id={project.id} name={project.name} />
            );
          })}
        </div>
      )}

      <Form />
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const { data: { session }} = await supabase.auth.getSession()

  if (!session) {
    return {
      props: {
        projects: null 
      }
    }
  }

  const { data } = await supabase.from("projects").select("id, name")

  return {
    props: {
      projects: data,
    }
  }
}
