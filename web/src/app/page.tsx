'use client'
import React from 'react'
  
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl text-sm">
        <p className="inline-flex font-mono w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Video transcoder for&nbsp;
          <code className="font-mono font-bold">Supabase Storage</code>
        </p>
        <h1 className='text-8xl uppercase font-mono font-light'>
          frostbyte
        </h1>
      </div>
      <div className="relative z-[-1] flex place-items-center before:absolute before:w-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0fff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] ">
      </div>
    </main>
  );
}
