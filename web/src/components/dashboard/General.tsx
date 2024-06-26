'use client'

import {
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import toast from 'react-hot-toast'

import Loader from '../Loader'
import SQLHelp from '../SQLHelp'
import { Project } from '@/utils/types'

interface GeneralProjectDashboardProps {
  project: Project | null;
  loading: boolean;
}

export default function GeneralProjectDashboard({
  project,
  loading,
}: GeneralProjectDashboardProps) {
  const [apiKeyHidden, setApiKeyHidden] = useState(true)

  const copyApiKey = () => {
    navigator.clipboard.writeText(project?.decrypted_api_key || "");
    toast.success("API Key copied to clipboard")
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-neutral-100 text-xl">
        Project details
      </h2>
      <div className="mt-4 max-w-md">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium leading-6 text-neutral-200">
                Frostbyte API Key
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type={apiKeyHidden ? "password" : "text"}
                  name="api-key"
                  id="api-key"
                  disabled
                  className="block bg-neutral-700 w-full rounded-md border-0 py-1.5 pr-16 text-neutral-400 shadow-sm ring-1 ring-neutral-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 disabled:ring-neutral-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed"
                  value={project?.decrypted_api_key}
                />
                <div
                  onClick={() => setApiKeyHidden(!apiKeyHidden)}
                  className="cursor-pointer absolute inset-y-0 right-6 flex items-center pr-3"
                >
                  {apiKeyHidden ? 
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    :
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  }
                </div>
                <div
                  onClick={copyApiKey}
                  className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <ClipboardDocumentIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <label htmlFor="url" className="block text-sm font-medium leading-6 text-neutral-200">
                Supabase URL
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="url"
                  id="url"
                  disabled
                  className="block bg-neutral-700 w-full rounded-md border-0 py-1.5 text-neutral-400 shadow-sm ring-1 ring-neutral-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 disabled:cursor-not-allowed disabled:ring-neutral-600 sm:text-sm sm:leading-6"
                  value={project?.supabase_url}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <h2 className="mt-6 text-neutral-100 text-xl">
        Instructions
      </h2>
      <SQLHelp />
      <h2 className="mt-1 text-neutral-100 text-xl">
        Things to know
      </h2>
      <ul className='py-4 list-disc list-inside'>
        <li className='pl-4 font-light text-white/50 pb-2'>
          Enable webhooks on your supabase project. Go to Database -&gt; Platform -&gt; Webhooks.
        </li>
        <li className='pl-4 font-light text-white/50 pb-2'>
          Due to resource constraints, files larger than 25MB will not be processed.
        </li>
      </ul>
    </div>
  )
}
