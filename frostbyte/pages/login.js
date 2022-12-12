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
    <div className="text-center bg-zinc-800 h-[calc(100vh-54px)] flex justify-center items-center flex-col">
      <h2 className="text-white text-7xl mb-5 -translate-y-16">
        ❄️
      </h2>
      <button onClick={handleLogin}
        className="bg-zinc-200 rounded w-60 text-zinc-800 py-1 -translate-y-16 hover:bg-zinc-300 duration-200"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}

