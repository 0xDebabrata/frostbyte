'use client'

import { useState } from "react"

import GeneralProjectDashboard from "@/components/dashboard/General"
import Jobs from "@/components/dashboard/Jobs"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface ProjectPageParams {
  params: {
    [k:string]: string;
  };
}

export default function ProjectPage({ params }: ProjectPageParams) {
  const projectId = parseInt(params["projectId"])

  const [navigation, setNavigation] = useState([
    { name: 'General', current: true, component: <GeneralProjectDashboard projectId={projectId} /> },
    { name: 'Jobs', current: false, component: <Jobs /> },
    { name: 'Logs', current: false },
  ])

  const updateNavigation = (idx: number) => {
    setNavigation(prev => {
      const updatedNav = prev.map(item => {
        item.current = false
        return item
      })
      updatedNav[idx].current = true
      return updatedNav
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-zinc-900">
      <header className="bg-neutral-900 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-mono leading-tight tracking-tight text-neutral-100">project 01</h1>
        </div>
      </header>

      <nav className="bg-neutral-800 border-b border-neutral-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="">
                <div className="flex items-baseline space-x-4">
                  {navigation.map((item, idx) => (
                    <p
                      key={item.name}
                      className={classNames(
                        item.current
                          ? 'bg-neutral-700 text-neutral-100'
                          : 'text-white hover:bg-neutral-700 hover:bg-opacity-75',
                        'rounded-md px-3 py-1 border border-neutral-600 text-sm duration-150 cursor-pointer'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                      onClick={() => updateNavigation(idx)}
                    >
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {navigation.filter(item => item.current)[0].component}
        </div>
      </main>
    </div>
  )
}
