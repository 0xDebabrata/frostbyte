import Image from "next/image"
import { useRouter } from "next/router"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'


export default function Form() {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [key, setKey] = useState("")

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch("/api/create-project", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(), url: url.trim(), secret: key.trim()
      })
    })
    const { id } = await response.json()
    router.push(`/project/${id}`)

    setName("")
    setUrl("")
    setKey("")
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="bg-white flex justify-center items-center rounded px-6 py-2 my-5 mx-auto text-sm font-medium text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <Image
          src="/supabase-logo-icon.svg"
          alt="Supabase logo"
          width={24}
          height={24}
          className="mr-2"
        />

        Connect project
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mb-5 text-lg text-zinc-100 flex items-center"
                  >
                    <Image
                      src="/supabase-logo-icon.svg"
                      alt="Supabase logo"
                      width={24}
                      height={24}
                      className="mr-4"
                    />
                    Project details
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor='projectName' className="text-zinc-400 font-light text-sm">Project Name</label>
                    <br />
                    <input type='text' 
                      className="px-2 py-1 text-sm mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none focus:border-zinc-500"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                    /> 
                    <br />
                    <label htmlFor='supabaseUrl' className="text-zinc-400 font-light text-sm">Supabase Project URL</label>
                    <br />
                    <input type='text'
                      className="px-2 py-1 text-sm mt-1 mb-2 w-full rounded font-light bg-zinc-700 text-zinc-300 border border-zinc-600 focus:outline-none focus:border-zinc-500"
                      required
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />
                    <br />
                    <label htmlFor='secretKey' className="text-zinc-400 font-light text-sm">Supabase Secret Key </label>
                    <br />
                    <input type='password'
                      className="px-2 py-1 text-sm mt-1 w-full rounded bg-zinc-700 text-zinc-300 border border-zinc-600 focus:outline-none focus:border-zinc-500"
                      required
                      value={key}
                      onChange={e => setKey(e.target.value)}
                    />
                    <br />
                    <button 
                      type="submit"
                      className='w-full py-1 mt-8 bg-zinc-300 text-zinc-800 rounded hover:bg-zinc-200 duration-150'>
                      Submit
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      </>
  );
}
