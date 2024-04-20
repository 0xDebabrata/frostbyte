'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/utils/supabase/client"

export default function Navbar() {
  const supabase = createClient()
  const router = useRouter()

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error)
    } else {
      router.push("/")
    }
  }

  return (
    <nav className="flex items-center justify-between px-10 sm:px-24 py-4 border-b border-neutral-700 text-neutral-100">
      <Link href={"/dashboard"}>
        <h1 className="uppercase font-mono">
          frostbyte ❄️
        </h1>
      </Link>
      <button
        onClick={logout}
        className="text-xs bg-neutral-700 border border-neutral-600 px-3 py-1 rounded hover:bg-neutral-600 duration-150"
      >
        Logout
      </button>
    </nav>
  )
}
