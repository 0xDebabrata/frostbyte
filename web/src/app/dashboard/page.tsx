"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CreateProjectModal from "@/components/Modal/CreateProjectModal";
import { createClient } from "@/utils/supabase/client";
import Loader from "@/components/Loader";
import { Project } from "@/utils/types";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format to DD/MM/YYYY
    const formattedDate = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  };

  const fetchProjects = async () => {
    setLoading(true);
    
    const { data: supabaseProjects, error } = await supabase
      .from("supabase_projects")
      .select("id, name, connected_at");

    if (!error) {
      console.error(error);
    }

    if (supabaseProjects) {
      setProjects(supabaseProjects);
    }
    setLoading(false);
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

  const redirectToProject = (projectId: number) => {
    router.push(`/dashboard/${projectId}`)
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-10 py-10 sm:px-24 min-h-screen bg-gradient-to-b from-neutral-800 to-zinc-900">
      <h1 className="font-mono text-3xl">Projects</h1>
      <button
        onClick={() => setOpen(true)}
        className="mt-5 rounded py-1 px-3 bg-teal-700 border border-teal-500 text-white text-xs"
      >
        New project
      </button>
      {loading ? (
        <div className="pt-10">
          <Loader />
        </div>
      ) : (
        <div className="pt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <div
              onClick={() => redirectToProject(project.id)}
              key={project.id}
              className="p-4 pb-10 rounded border border-neutral-700 bg-neutral-800 cursor-pointer hover:bg-stone-800 duration-200"
            >
              <p className="font-light text-neutral-100 pb-2">{project.name}</p>
              <p className="font-light text-sm text-neutral-400">
                Created at: {formatDate(project.connected_at!)}
              </p>
            </div>
          ))}
        </div>
      )}
      <CreateProjectModal open={open} setOpen={setOpen} />
    </div>
  );
}
