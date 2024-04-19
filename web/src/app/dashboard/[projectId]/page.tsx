'use client'

import { useState } from "react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProjectPage() {
  const [navigation, setNavigation] = useState([
    { name: 'General', href: '#', current: true },
    { name: 'Jobs', href: '#', current: false },
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
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  {navigation.map((item, idx) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-neutral-700 text-neutral-100'
                          : 'text-white hover:bg-neutral-700 hover:bg-opacity-75',
                        'rounded-md px-3 py-2 text-sm duration-150'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                      onClick={() => updateNavigation(idx)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{/* Your content */}</div>
      </main>
    </div>
  )
}
