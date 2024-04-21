import { useEffect, useState } from "react";

import CreateJobForm from "@/components/CreateJob";
import { createClient } from "@/utils/supabase/client";
import { Bucket } from "@/utils/types";
import {
  ArrowPathIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import Loader from "../Loader";
import toast from "react-hot-toast";

interface JobsProps {
  projectId: number;
}

export default function Jobs({ projectId }: JobsProps) {
  const supabase = createClient();

  const [openPanel, setOpenPanel] = useState(false);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchSupabaseProjectBuckets = async () => {
    const {
      data: { buckets },
      error,
    } = await supabase.functions.invoke("get-input-buckets", {
      body: { projectId: projectId },
    });
    if (error) {
      console.error(error);
      return;
    }
    setBuckets(buckets);
  };

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

  const fetchJobs = async () => {
    setLoading(true);
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select(
        "id, name, created_at, input_bucket, output_bucket, format, resolution, quality"
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setJobs(jobs);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [refresh]);

  useEffect(() => {
    fetchSupabaseProjectBuckets();
  }, []);

  const copyJobId = (jobId: string) => {
    navigator.clipboard.writeText(jobId);
    toast.success("Job ID copied to clipboard");
  };

  return (
    <div>
      <div className="flex flex-row items-center">
        <button
          onClick={() => setOpenPanel(true)}
          className="rounded-md py-1 px-3 bg-teal-700 border border-teal-500 text-white text-xs"
        >
          New
        </button>

        <button
          onClick={() => setRefresh(!refresh)}
          className="transition ease-in-out delay-150 ml-4 bg-teal-700 bg-opacity-0 flex flex-row items-center rounded-md py-1 pr-2 text-white text-xs hover:bg-opacity-40 duration-200"
        >
          {loading ? (
            <Loader />
          ) : (
            <ArrowPathIcon className="mx-2 w-5 h-5 opacity-50" />
          )}
          Refresh
        </button>
      </div>
      <div className="pt-5 flex flex-col">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="mb-4 relative p-4 max-w-5xl rounded border border-neutral-700 bg-neutral-800 cursor-pointer hover:bg-stone-800 duration-200"
          >
            <div className="flex flex-row mb-4">
              <p className="font-light text-neutral-100 pb-2">{job.name}</p>
              <p className="pl-4 font-light text-white/50 pb-2">
                {job.input_bucket} -&gt; {job.output_bucket}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <span className="absolute font-mono top-4 right-4 inline-flex items-center rounded-xl bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
                {job.id}
                <div
                  onClick={() => copyJobId(job.id)}
                  className="cursor-pointer inset-y-0 right-0 flex items-center pl-2"
                >
                  <ClipboardDocumentIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </span>
              <p className="font-light text-sm text-neutral-400">
                Format:{" "}
                <span className="font-light text-sm text-neutral-100">
                  {job.format}
                </span>
              </p>
              <p className="font-light text-sm text-neutral-400">
                Resolution:{" "}
                <span className="font-light text-sm text-neutral-100">
                  {job.resolution}
                </span>
              </p>
              <p className="font-light text-sm text-neutral-400">
                Quality:{" "}
                <span className="font-light text-sm text-neutral-100">
                  {job.quality}
                </span>
              </p>
              <p className="font-light text-sm text-neutral-400">
                Created:{" "}
                <span className="font-light text-sm text-neutral-100">
                  {formatDate(job.created_at!)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <CreateJobForm
        buckets={buckets.map((b) => b.id)}
        open={openPanel}
        projectId={projectId}
        setOpen={setOpenPanel}
      />
    </div>
  );
}
