import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import { Unbounded } from "@next/font/google"
import { useRouter } from "next/router"

const unbounded = Unbounded({ subsets: ["latin"] })

export default function Navbar() {

  return (
    <div className="flex items-center justify-between bg-zinc-800 p-3">
      <Link href="/" className="cursor-default">
        <h1 className={`${unbounded.className} text-zinc-200 ml-4 text-xl`}>
          ❄️   Frostbyte
        </h1>
      </Link>
      <Button />
    </div>
  )
}

const Button = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (session) {
    return (
      <button onClick={handleLogout}
        className="rounded py-1 px-4 text-zinc-300 mr-4 text-sm duration-150 hover:bg-zinc-700 border border-zinc-600"
      >
        Logout
      </button>
    )
  } else {
    return (
      <Link href="/login"
        className="rounded bg-zinc-700 py-1 px-4 text-zinc-300 mr-4 text-sm duration-150 hover:bg-zinc-600 border border-zinc-600"
      >
        Sign in
      </Link>
    )
  }
}
