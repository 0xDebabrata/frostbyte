'use client'

import {
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { createClient } from '@/utils/supabase/client'
import Loader from '../Loader'

interface GeneralProjectDashboardProps {
  projectId: number;
}

export default function GeneralProjectDashboard({
  projectId,
}: GeneralProjectDashboardProps) {
  const supabase = createClient()
  const [project, setProject] = useState<Project|null>(null)
  const [loading, setLoading] = useState(true)

  const [apiKeyHidden, setApiKeyHidden] = useState(true)

  const fetchProjectDetails = async () => {
    const { data } = await supabase
      .from("supabase_projects")
      .select("id, name, supabase_url")
      .eq("id", projectId)
    if (data && data.length) {
      const apiKey = await fetchApiKey()
      setProject({
        ...data[0],
        decrypted_api_key: apiKey,
      })
      setLoading(false)
    }
  }
  const fetchApiKey = async () => {
    const resp = await fetch(`/api/project/apiKey?projectId=${projectId}`)
    const { apiKey } = await resp.json()
    return apiKey as string
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(project?.decrypted_api_key || "");
    toast.success("API Key copied to clipboard")
  }

  useEffect(() => {
    fetchProjectDetails()
    fetchApiKey()
  }, [])

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
                API Key
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
                  value={project.supabase_url}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <h2 className="mt-6 text-neutral-100 text-xl">
        Instructions
      </h2>
    </div>
  )
}
