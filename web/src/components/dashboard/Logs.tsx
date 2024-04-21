import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import {
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Loader from "../Loader";

interface JobsProps {
  projectId: number;
}

const backgroundColors = {
  "queued": "bg-gray-700",
  "processing": "bg-blue-900",
  "complete": "bg-teal-800",
  "failed": "bg-red-900",
}
const borderColors = {
  "queued": "border-gray-600",
  "processing": "border-blue-700",
  "complete": "border-teal-600",
  "failed": "border-red-700",
}

export default function Logs({ projectId }: JobsProps) {
  const supabase = createClient();

  const [logs, setLogs] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format to DD/MM/YYYY
    const formattedDate = date.toUTCString();
    return formattedDate;
  };

  const fetchLogs = async () => {
    setLoading(true);
    const { data: logs, error } = await supabase
      .from("logs")
      .select(
        "id, job_id, project_id, status, message, created_at, processed_at, jobs (name), metadata"
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }
    console.log(logs)

    setLogs(logs);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [refresh]);

  return (
    <div>
      <div className="flex flex-row items-center">
        <button
          onClick={() => setRefresh(!refresh)}
          className="transition ease-in-out delay-150 bg-teal-700 bg-opacity-0 flex flex-row items-center rounded-md py-1 pr-2 text-white text-xs hover:bg-opacity-40 duration-200"
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
        {logs.map((log) => (
          <div
            key={log.id}
            className="mb-2 relative py-2 px-4 max-w-5xl rounded border border-neutral-700 bg-neutral-800 cursor-pointer hover:bg-stone-800 duration-200"
          >
            <div className="flex items-center justify-between flex-row space-x-4">
              <div className="flex items-center space-x-4">
                <p className="font-light text-sm text-neutral-100">{log.jobs.name}</p>
                {/* @ts-ignore */}
                <div className={`flex pb-1 items-center leading-0 text-white ${backgroundColors[log.status]} border ${borderColors[log.status]} py-0.5 px-3 rounded-full text-xs`}>
                  <p className="font-mono">{log.status}</p>
                </div>
              </div>
              <p className="font-light text-xs text-neutral-400">
                Created:{" "}
                <span className="font-light text-xs text-neutral-100">
                  {formatDate(log.created_at!)}
                </span>
              </p>
            </div>
            {log.status === "failed" ? <p className="text-neutral-400 text-xs mt-2">
              {log.message}
            </p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
