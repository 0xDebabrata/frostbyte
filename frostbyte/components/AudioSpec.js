import { useEffect } from "react"

import Dropdown from "./Dropdown"

const codecs = ["MP3", "WAV", "AAC"]

export default function AudioSpec({ spec, setSpec }) {
  useEffect(() => {
    setSpec({ operation: "separate audio", format: codecs[0] })
  }, [])

  const setFormat = (val) => {
    setSpec(prev => ({...prev, format: val }))
  }

  return (
    <>
      <label className="text-zinc-400 font-light text-sm">Output codec</label>
      <Dropdown options={codecs} selected={spec.format} setSelected={setFormat} />
    </>
  )
}

