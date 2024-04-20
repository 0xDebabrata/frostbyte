import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import Dropdown from "@/components/Dropdown";

interface CreateJobFormProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateJobForm({
  open, setOpen,
}: CreateJobFormProps) {
  const inputBucketChoices = [
    "Durward Reynolds",
    "Debarghya Mondal",
    "Therese Wunsch",
    "Benedict Kessler",
    "Katelyn Rohan",
  ];
  const [inputBucket, setInputBucket] = useState("");

  const outputBucketChoices = [
    "Durward Reynolds",
    "Debarghya Mondal",
    "Therese Wunsch",
    "Benedict Kessler",
    "Katelyn Rohan",
  ];
  const [outputBucket, setOutputBucket] = useState("");

  const outputFormatChoices = [
    "Original",
    "H.264",
    "H.265",
    // "VP9",
  ];
  const [outputFormat, setOutputFormat] = useState(outputFormatChoices[0]);

  const outputResolutionChoices = [
    "Original",
    "4k",
    "1080p",
    "720p",
    "360p",
  ];
  const [outputResolution, setOutputResolution] = useState(outputResolutionChoices[0]);

  const outputQualityChoices = [
    "Best",
    "High",
    "Medium",
    "Low",
  ];
  const [outputQuality, setOutputQuality] = useState(outputQualityChoices[0]);

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
                      <form className="w-full">
                        <div>
                          <div className="border-b border-gray-900/10 pb-12">
                            <p className="mt-1 text-sm leading-6 text-neutral-400">
                              Use this form to select job parameters for this project
                            </p>

                            <div className="mt-4">
                              {/* Input bucket  */}
                              <div>
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
                        <div className='flex'>
                          <button
                            onClick={() => setOpen(false)}
                            className="ml-auto rounded py-1 px-3 bg-teal-700 border border-teal-500 text-white text-sm"
                          >
                            Create
                          </button>
                        </div>
                      </form>
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
