import { useRouter } from "next/router"
import { Fragment, useState } from 'react'
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"

import Dropdown from "./Dropdown"
import VideoSpec from "./VideoSpec"
import AudioSpec from "./AudioSpec"

const operations = [
  "Transcode video",
  "Separate audio",
]

export default function NewTask({ buckets }) {
  const router = useRouter()
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const [name, setName] = useState("")
  const [source, setSource] = useState(buckets[0])
  const [destination, setDestination] = useState(buckets[0])
  const [spec, setSpec] = useState({ operation: operations[0].toLowerCase() })

  const setOperation = (val) => {
    setSpec(prev => ({ ...prev, operation: val.toLowerCase() }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { id } = router.query

    await supabaseClient.from("tasks").insert({
      name, source_bucket: source, destination_bucket: destination, spec, project_id: id, user_id: user.id
    })

    router.reload()
  }

  return (
      <div className="py-5 px-10 flex flex-col sm:flex-row items-start w-full bg-zinc-900 border-2 border-zinc-800 rounded">
      <p className="w-[45%] text-zinc-200 text-sm pb-5 sm:pt-1">
        Create new task
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        <label className="text-zinc-400 font-light text-sm">Name</label>
        <input type='text' 
          className="px-2 py-1 text-sm w-full mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Transcode videos to .mp4"
          required
          /> 
        <label className="text-zinc-400 font-light text-sm">Source bucket</label>
        <Dropdown options={buckets} selected={source} setSelected={setSource} />
        <label className="text-zinc-400 font-light text-sm">Destination bucket</label>
        <Dropdown options={buckets} selected={destination} setSelected={setDestination} />
        <label className="text-zinc-400 font-light text-sm">Operation</label>
        <Dropdown options={operations} selected={spec.operation} setSelected={setOperation} />
        {spec.operation === "transcode video" && (
          <VideoSpec spec={spec} setSpec={setSpec} />
        )}
        {spec.operation === "separate audio" && (
          <AudioSpec spec={spec} setSpec={setSpec} />
        )}

        <button type="submit" className="w-full py-1 bg-zinc-300 rounded text-sm mt-4 duration-150 hover:bg-zinc-200 border border-zinc-200">
          Save
        </button>
      </form>
    </div>
  );
}

