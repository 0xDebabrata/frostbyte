"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initialiseUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("User", data);
      if (error) {
        console.log(error);
      } else {
        if (data) {
          // console.log("User was retrieved", user);
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    };

    initialiseUser();
  }, []);
}
