"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
        
import { createClient } from "@/utils/supabase/client";
import GeneralProjectDashboard from "@/components/dashboard/General";
import Jobs from "@/components/dashboard/Jobs";
import { Project } from "@/utils/types"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ProjectPageParams {
  params: {
    [k: string]: string;
  };
}

export default function ProjectPage({ params }: ProjectPageParams) {
  const supabase = createClient()
  const router = useRouter();

  const projectId = parseInt(params["projectId"])
  const [projectLoading, setProjectLoading] = useState(true)
  const [project, setProject] = useState<Project|null>(null)

  const [navigation, setNavigation] = useState([
    { name: 'General', current: true },
    { name: 'Jobs', current: false },
    { name: 'Logs', current: false },
  ])

  const updateNavigation = (idx: number) => {
    setNavigation((prev) => {
      const updatedNav = prev.map((item) => {
        item.current = false;
        return item;
      });
      updatedNav[idx].current = true;
      return updatedNav;
    });
  };

  // Redirect to login if user not signed in
  useEffect(() => {
    const redirectLoggedOutUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/");
      }
    };

    redirectLoggedOutUser();
  }, []);

  const fetchProjectDetails = async () => {
    const { data } = await supabase
      .from("supabase_projects")
      .select("id, name, supabase_url")
      .eq("id", projectId)
    if (data && data.length) {
      const apiKey = await fetchApiKey()
      setProject({
        ...data[0],
        decrypted_api_key: apiKey,
      })
      setProjectLoading(false)
    }
  }
  const fetchApiKey = async () => {
    const resp = await fetch(`/api/project/apiKey?projectId=${projectId}`)
    const { apiKey } = await resp.json()
    return apiKey as string
  }

  useEffect(() => {
    fetchProjectDetails()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-zinc-900">
      <header className="bg-neutral-900 shadow">
        <div className="max-w-7xl px-10 py-6 sm:px-24">
          <h1 className="text-3xl font-bold font-mono leading-tight tracking-tight text-neutral-100">
            {project?.name || "frostbyte project"}
          </h1>
        </div>
      </header>

      <nav className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-7xl px-10 sm:px-24">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="">
                <div className="flex items-baseline space-x-4">
                  {navigation.map((item, idx) => (
                    <p
                      key={item.name}
                      className={classNames(
                        item.current
                          ? 'bg-neutral-700 text-neutral-100'
                          : 'text-white hover:bg-neutral-700 hover:bg-opacity-75',
                        'rounded-md px-3 py-1 border border-neutral-600 text-sm duration-150 cursor-pointer'
                      )}
                      aria-current={item.current ? "page" : undefined}
                      onClick={() => updateNavigation(idx)}
                    >
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-6 px-10 sm:px-24">
          {navigation.filter(item => item.current)[0].name === "General" && (
            <GeneralProjectDashboard
              project={project}
              loading={projectLoading}
            />
          )}
          {navigation.filter(item => item.current)[0].name === "Jobs" && (
            <Jobs
              projectId={projectId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
