import { useState } from "react"

import CreateJobForm from "@/components/CreateJob"

export default function Jobs() {
  const [openPanel, setOpenPanel] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpenPanel(true)}
        className="mt-5 rounded py-1 px-3 bg-teal-700 border border-teal-500 text-white text-xs"
      >
        New
      </button>
      <CreateJobForm
        open={openPanel}
        setOpen={setOpenPanel}
      />
    </div>
  )
}
