import { Dispatch, Fragment, SetStateAction, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface CreateProjectModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateProjectModal({
  open,
  setOpen,
}: CreateProjectModalProps) {
  const [name, setName] = useState("")
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-65 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-800 p-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="text-left">
                    <Dialog.Title as="h3" className="text-base leading-6 text-neutral-100">
                      Create new project
                    </Dialog.Title>
                    <div className='mt-4'>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-neutral-200">
                        Project name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="block w-full rounded-md border-0 py-1.5 text-neutral-200 bg-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-400 sm:text-sm sm:leading-6"
                          placeholder="supabase"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='mt-2'>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-neutral-200">
                        Supabase URL
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="url"
                          id="url"
                          className="block w-full rounded-md border-0 py-1.5 text-neutral-200 bg-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-400 sm:text-sm sm:leading-6"
                          placeholder="https://xyz.supabase.co"
                          value={supabaseUrl}
                          onChange={(e) => setSupabaseUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='mt-2'>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-neutral-200">
                        Supabase Service Role Key
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="key"
                          id="key"
                          className="block w-full rounded-md border-0 py-1.5 text-neutral-200 bg-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-400 sm:text-sm sm:leading-6"
                          placeholder="Your Supabase project's service role key"
                          value={supabaseKey}
                          onChange={(e) => setSupabaseKey(e.target.value)}
                        />
                      </div>
                      <p className="mt-2 text-sm font-light text-neutral-500" id="email-description">
                        We encrypt this value.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-teal-700 px-3 py-2 text-sm text-white shadow-sm hover:bg-teal-600 duration-150 border border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={() => setOpen(false)}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-neutral-700 px-3 py-2 text-sm text-neutral-400 shadow-sm ring-1 ring-inset ring-neutral-600 hover:bg-neutral-600 duration-150 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

