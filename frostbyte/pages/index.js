import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import Card from "../components/ProjectCard.js";
import Form from "../components/Forms.js";

export default function Home({ projects: projectsSSR }) {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const [projects, setProjects] = useState(projectsSSR)

  const array = [
    { projectID: 1, projectName: "First Project" },
    { projectID: 2, projectName: "Second Project" },
    { projectID: 3, projectName: "Third  Project" },
    { projectID: 4, projectName: "fourth  Project" },
  ];

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
      <div>
        <main>
          <h1>Frostbyte</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800">
      <div className="flex justify-center max-w-[800px] min-h-[calc(100vh-54px)] mx-auto">
        {array.map((project, idx) => {
          return (
            <Card key={idx} id={project.projectID} name={project.projectName} />
          );
        })}
        {/*<Form />*/}
      </div>
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
