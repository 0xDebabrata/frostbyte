"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const supabase = createClientComponentClient();
  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) {
      console.log(error);
    }
  }

  return (
    <div className="mx-auto font-mono flex min-h-screen flex-col items-center justify-between p-24">
      <button
        className="bg-indigo-400 w-64 p-2 text-white text-semibold rounded-md"
        onClick={signInWithGithub}
      >
        Sign in with Github
      </button>
    </div>
  );
}
