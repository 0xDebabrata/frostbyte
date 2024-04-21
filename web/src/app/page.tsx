"use client";

import {
  ArrowPathIcon,
  BeakerIcon,
  BoltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { createClient } from "../utils/supabase/client";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  async function signInWithGithub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo:
          (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") +
          "/dashboard",
      },
    });
    if (error) {
      console.error(error);
    }
  }

  function redirectToDashboard() {
    router.push("/dashboard");
  }

  useEffect(() => {
    const initialiseUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    initialiseUser();
  }, []);

  const actions = [
    {
      title: "Supabase integration",
      icon: BoltIcon,
      iconForeground: "text-teal-700",
      iconBackground: "bg-teal-100",
      description: "Easy integration with Supabase Storage",
    },
    {
      title: "Automations",
      icon: ArrowPathIcon,
      iconForeground: "text-purple-700",
      iconBackground: "bg-purple-100",
      description: "Trigger transcoding jobs automatically on file uploads",
    },
    {
      title: "High quality outputs",
      icon: SparklesIcon,
      iconForeground: "text-sky-700",
      iconBackground: "bg-sky-100",
      description:
        "Efficient transcoding process maintaining high quality output standards",
    },
    {
      title: "Simple configuration",
      icon: BeakerIcon,
      iconForeground: "text-yellow-700",
      iconBackground: "bg-yellow-100",
      description: "Simple yet flexible transcoding options",
    },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 lg:p-24">
      <div className="z-10 w-full max-w-5xl text-sm">
        <p className="inline-flex font-mono justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Video transcoder for&nbsp;
          <code className="font-mono font-bold">Supabase Storage</code>
        </p>
        <h1 className="flex items-center space-x-4 text-5xl lg:text-8xl uppercase font-mono font-light">
          frostbyte <span className="text-4xl lg:text-7xl">&nbsp;❄️</span>
        </h1>
        <button
          onClick={!user ? signInWithGithub : redirectToDashboard}
          className="mt-10 rounded w-64 bg-neutral-300 border border-white p-2 hover:bg-neutral-100 duration-150 text-neutral-900 cursor-pointer"
        >
          {!user ? "Sign in with Github" : "Go to dashboard"}
        </button>
      </div>

      {/* Features */}
      <div className="my-10 divide-y divide-neutral-600 overflow-hidden rounded-lg shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        {actions.map((action, actionIdx) => (
          <div
            key={action.title}
            className={classNames(
              actionIdx === 0
                ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                : "",
              actionIdx === 1 ? "sm:rounded-tr-lg" : "",
              actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
              actionIdx === actions.length - 1
                ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                : "",
              "group transition relative bg-white/10 hover:bg-white/20 p-6 focus-within:ring-2 focus-within:ring-inset duration-250"
            )}
          >
            <div>
              <span
                className={classNames(
                  action.iconBackground,
                  action.iconForeground,
                  "inline-flex rounded-lg p-3 ring-4 ring-neutral-600"
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-base font-semibold leading-6 text-neutral-200">
                <p className="focus:outline-none">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.title}
                </p>
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cool effect */}
      <div className="relative z-[-1] flex place-items-center before:absolute before:w-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0fff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] "></div>
    </main>
  );
}
