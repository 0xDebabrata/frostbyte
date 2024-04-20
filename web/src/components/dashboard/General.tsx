import {
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function GeneralProjectDashboard() {
  const project = {
    connected_at: (new Date()).toLocaleString, 
    id: 11,
    key_id: "",
    name: "project 01",
    supabase_secret_key: "",
    supabase_url: "https://xyz.supabase.co",
    user_id: "abc",
    api_key: "sk_abc",
  }

  const [apiKeyHidden, setApiKeyHidden] = useState(true)

  const copyApiKey = () => {
    navigator.clipboard.writeText(project.api_key);
    toast.success("API Key copied to clipboard")
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-neutral-100 text-xl">
        Project details
      </h2>
      <div className="mt-4 max-w-md">
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium leading-6 text-neutral-200">
            API Key
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              type={apiKeyHidden ? "password" : "text"}
              name="api-key"
              id="api-key"
              disabled
              className="block bg-neutral-700 w-full rounded-md border-0 py-1.5 text-neutral-400 shadow-sm ring-1 ring-neutral-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 disabled:ring-neutral-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed"
              value={project.api_key}
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
              value={project.supabase_url}
            />
          </div>
        </div>
      </div>
      <h2 className="mt-6 text-neutral-100 text-xl">
        Instructions
      </h2>
    </div>
  )
}
