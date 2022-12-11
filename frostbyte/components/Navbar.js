import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"

export default function Navbar() {

  return (
    <div className="bg-zinc-800">
      <Button />
    </div>
  )
}

const Button = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <button onClick={handleLogout}>
        Logout
      </button>
    )
  } else {
    return (
      <Link href="/login">
        Login
      </Link>
    )
  }
}
