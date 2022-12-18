import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

export default function Dropdown({ options, selected, setSelected }) {

  return (
    <div>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full mb-2 cursor-default rounded bg-zinc-700 py-1 px-2 font-light text-zinc-300 text-left border border-zinc-600 shadow-md focus:outline-none text-sm">
            <span className="block truncate">{selected}</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded bg-zinc-700 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-1 px-2 ${
                      active ? 'bg-zinc-600 text-zinc-300' : 'text-zinc-400'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-normal' : 'font-light'
                        }`}
                      >
                        {option}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

