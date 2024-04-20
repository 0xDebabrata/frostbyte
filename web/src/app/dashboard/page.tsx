"use client";

import { useEffect, useState } from "react";

import { Database } from "@/utils/supabase";
import CreateProjectModal from "@/components/Modal/CreateProjectModal";
import { createClient } from "@/utils/supabase/client";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<
    Database["public"]["Tables"]["supabase_projects"]["Row"][]
  >([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format to DD/MM/YYYY
    const formattedDate = date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data: supabase_projects, error } = await supabase
      .from("supabase_projects")
      .select("id, name, connected_at");

    console.log("Data", supabase_projects);
    if (!error) {
      console.error(error);
    }

    setProjects(supabase_projects);
    setLoading(false);
  };

  // Redirect to login if user not signed in
  useEffect(() => {
    console.log("Check user signed in");
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    };
    const session = fetchSession();
    if (!session.session) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-10 py-10 lg:px-24 min-h-screen bg-gradient-to-b from-neutral-800 to-zinc-900">
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
              key={project.id}
              className="p-4 pb-10 rounded border border-neutral-700 bg-neutral-800 cursor-pointer hover:bg-stone-800 duration-200"
            >
              <p className="font-light text-neutral-100 pb-2">{project.name}</p>
              <p className="font-light text-sm text-neutral-400">
                Created at: {formatDate(project.connected_at)}
              </p>
            </div>
          ))}
        </div>
      )}
      <CreateProjectModal open={open} setOpen={setOpen} />
    </div>
  );
}
