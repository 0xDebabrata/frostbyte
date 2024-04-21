import { Dispatch, FormEvent, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import Dropdown from "@/components/Dropdown";
import SQLHelp from './SQLHelp';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

interface CreateJobFormProps {
  buckets: string[];
  open: boolean;
  projectId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateJobForm({
  buckets, open, projectId, setOpen, refresh, setRefresh,
}: CreateJobFormProps) {
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")

  const inputBucketChoices = buckets
  const [inputBucket, setInputBucket] = useState("");

  const outputBucketChoices = buckets
  const [outputBucket, setOutputBucket] = useState("");

  const outputFormatChoices = [
    "Original",
    "H264",
    "H265",
    // "VP9",
  ];
  const [outputFormat, setOutputFormat] = useState(outputFormatChoices[0]);

  const outputResolutionChoices = [
    "Original",
    "4k",
    "1080p",
    "720p",
    "480p",
  ];
  const [outputResolution, setOutputResolution] = useState(outputResolutionChoices[0]);

  const outputQualityChoices = [
    "Best",
    "High",
    "Medium",
    "Low",
  ];
  const [outputQuality, setOutputQuality] = useState(outputQualityChoices[0]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (
      !name ||
      !inputBucket ||
      !outputBucket ||
      !outputFormat ||
      !outputResolution ||
      !outputQuality ||
      !name.trim() ||
      !inputBucket.trim() ||
      !outputBucket.trim() ||
      !outputFormat.trim() ||
      !outputResolution.trim() ||
      !outputQuality.trim()
    ) {
      toast.error("Please fill all the details")
      return
    }

    setLoading(true)

    await fetch("/api/project/job", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        name,
        inputBucket,
        outputBucket,
        outputFormat,
        outputResolution,
        outputQuality,
      })
    })

    toast.success("Job created! Please follow further integration instructions", {
      duration: 8000
    })
    setLoading(false)
    setRefresh(!refresh)
    setOpen(false)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-65 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-neutral-800 py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base leading-6 text-neutral-100">
                          Create job
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md text-neutral-200 hover:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 duration-150"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <form
                        className="w-full"
                        onSubmit={handleSubmit}
                      >
                        <div>
                          <div className="border-b border-gray-900/10 pb-12">
                            <p className="mt-1 text-sm leading-6 text-neutral-400">
                              Configure transcoding parameters for videos uploaded to your input bucket.
                            </p>
                            <div className="mt-4">
                              {/* Job name */}
                              <div>
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium leading-6 text-neutral-200"
                                >
                                  Job name
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-200 bg-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-400 sm:text-sm sm:leading-6"
                                    placeholder="netflix-01"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>

                              {/* Input bucket  */}
                              <div className="mt-4">
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium leading-6 text-neutral-200"
                                >
                                  Input bucket
                                </label>
                                <div className="mt-2">
                                  <Dropdown
                                    choice={inputBucketChoices}
                                    selectedOption={inputBucket}
                                    setSelectedOption={setInputBucket}
                                  />
                                </div>
                                {!buckets.length ? (
                                  <p className="mt-2 text-xs text-neutral-400" id="email-description">
                                    Linked Supabase project doesn&apos;t have any buckets
                                  </p>
                                ) : null}
                              </div>

                              {/* Output bucket */}
                              <div className="mt-4">
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium leading-6 text-neutral-200"
                                >
                                  Output bucket
                                </label>
                                <div className="mt-2">
                                  <Dropdown
                                    choice={outputBucketChoices}
                                    selectedOption={outputBucket}
                                    setSelectedOption={setOutputBucket}
                                  />
                                </div>
                                {!buckets.length ? (
                                  <p className="mt-2 text-xs text-neutral-400" id="email-description">
                                    Linked Supabase project doesn&apos;t have any buckets
                                  </p>
                                ) : null}
                              </div>

                              {/* Output format  */}
                              <div className="mt-4">
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium leading-6 text-neutral-200"
                                >
                                  Output format
                                </label>
                                <div className="mt-2">
                                  <Dropdown
                                    choice={outputFormatChoices}
                                    selectedOption={outputFormat}
                                    setSelectedOption={setOutputFormat}
                                  />
                                </div>
                              </div>

                              {/* Output resolution  */}
                              <div className="mt-4">
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium leading-6 text-neutral-200"
                                >
                                  Resolution
                                </label>
                                <div className="mt-2">
                                  <Dropdown
                                    choice={outputResolutionChoices}
                                    selectedOption={outputResolution}
                                    setSelectedOption={setOutputResolution}
                                  />
                                </div>
                              </div>

                              {/* Output quality  */}
                              <div className="mt-4">
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium leading-6 text-neutral-200"
                                >
                                  Output quality
                                </label>
                                <div className="mt-2">
                                  <Dropdown
                                    choice={outputQualityChoices}
                                    selectedOption={outputQuality}
                                    setSelectedOption={setOutputQuality}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          type='submit'
                          disabled={loading}
                          className="w-full flex items-center justify-center rounded py-2 px-3 bg-teal-700 border border-teal-500 text-white text-sm"
                        >
                          Create
                          {loading && <Loader />}
                        </button>
                      </form>
                      <div className='py-5'>
                        <SQLHelp />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
