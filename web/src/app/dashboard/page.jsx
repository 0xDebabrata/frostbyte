"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const initialiseUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      console.log("User", user);
      if (error) {
        console.log(error);
      }
    };

    initialiseUser();
  }, []);

  async function signOut() {
    console.log("signing out");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Projects</h1>
      <p>Hello</p>

      <button
        className="bg-indigo-400 w-64 p-2 text-white text-semibold rounded-md"
        onClick={signOut}
      >
        Sign out
      </button>
    </main>
  );
}
