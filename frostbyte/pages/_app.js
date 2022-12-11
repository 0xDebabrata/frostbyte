import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { useState } from "react"

import Navbar from "../components/Navbar"

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient()) 

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Navbar />
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default MyApp
