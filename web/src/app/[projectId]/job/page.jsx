"use client";

import Dropdown from "@/components/Dropdown";
import { useState } from "react";

export default function Job({ params }) {
  const projectId = params.projectId;

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
    "Durward Reynolds",
    "Debarghya Mondal",
    "Therese Wunsch",
    "Benedict Kessler",
    "Katelyn Rohan",
  ];
  const [outputFormat, setOutputFormat] = useState("");

  const outputResolutionChoices = [
    "Durward Reynolds",
    "Debarghya Mondal",
    "Therese Wunsch",
    "Benedict Kessler",
    "Katelyn Rohan",
  ];
  const [outputResolution, setOutputResolution] = useState("");

  const outputQualityChoices = [
    "Durward Reynolds",
    "Debarghya Mondal",
    "Therese Wunsch",
    "Benedict Kessler",
    "Katelyn Rohan",
  ];
  const [outputQuality, setOutputQuality] = useState("");

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Job
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use this form to select job parameters for this project
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Input bucket  */}
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Input bucket
              </label>
              <div className="mt-2">
                <div className="flex sm:max-w-md">
                  <span className="flex select-none items-center pr-2 text-gray-500 sm:text-sm">
                    {projectId}.supabase.co/storage/v1/object/public/
                  </span>
                  <Dropdown
                    choice={inputBucketChoices}
                    selectedOption={inputBucket}
                    setSelectedOption={setInputBucket}
                  />
                </div>
              </div>
            </div>

            {/* Output bucket */}
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Output bucket
              </label>
              <div className="mt-2">
                <div className="flex sm:max-w-md">
                  <span className="flex select-none items-center pr-2 text-gray-500 sm:text-sm">
                    {projectId}.supabase.co/storage/v1/object/public/
                  </span>
                  <Dropdown
                    choice={outputBucketChoices}
                    selectedOption={outputBucket}
                    setSelectedOption={setOutputBucket}
                  />
                </div>
              </div>
            </div>

            {/* Output format  */}
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Output format
              </label>
              <div className="mt-2">
                <div className="flex sm:max-w-md">
                  <Dropdown
                    choice={outputFormatChoices}
                    selectedOption={outputFormat}
                    setSelectedOption={setOutputFormat}
                  />
                </div>
              </div>
            </div>

            {/* Output resolution  */}
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Resolution
              </label>
              <div className="mt-2">
                <div className="flex sm:max-w-md">
                  <Dropdown
                    choice={outputResolutionChoices}
                    selectedOption={outputResolution}
                    setSelectedOption={setOutputResolution}
                  />
                </div>
              </div>
            </div>

            {/* Output quality  */}
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Output quality
              </label>
              <div className="mt-2">
                <div className="flex sm:max-w-md">
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
      </div>
    </form>
  );
}
