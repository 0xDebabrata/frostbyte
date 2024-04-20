import { useEffect, useState } from "react"

import CreateJobForm from "@/components/CreateJob"
import { createClient } from "@/utils/supabase/client"
import { Bucket } from "@/utils/types";

interface JobsProps {
  projectId: number;
}

export default function Jobs({
  projectId
}: JobsProps) {
  const supabase = createClient()

  const [openPanel, setOpenPanel] = useState(false)
  const [buckets, setBuckets] = useState<Bucket[]>([])

  const fetchSupabaseProjectBuckets = async () => {
    const { data: { buckets }, error } = await supabase.functions.invoke('get-input-buckets', {
      body: { projectId: projectId }
    })
    if (error) {
      console.error(error)
      return
    }
    setBuckets(buckets)
  }

  useEffect(() => {
    fetchSupabaseProjectBuckets()
  }, [])

  return (
    <div>
      <button
        onClick={() => setOpenPanel(true)}
        className="mt-5 rounded py-1 px-3 bg-teal-700 border border-teal-500 text-white text-xs"
      >
        New
      </button>
      <CreateJobForm
        buckets={buckets.map(b => b.id)}
        open={openPanel}
        projectId={projectId}
        setOpen={setOpenPanel}
      />
    </div>
  )
}
