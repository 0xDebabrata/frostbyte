import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function Login() {
  const supabase = useSupabaseClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_APP_URL
      }
    })
  }

  return (
    <div>
      <button onClick={handleLogin}>
        Sign in with GitHub
      </button>
    </div>
  );
}

