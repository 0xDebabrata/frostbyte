import { Dispatch, SetStateAction, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

interface DropdownProps {
  choice: string[];
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
}

function Dropdown({
  choice,
  selectedOption,
  setSelectedOption,
}: DropdownProps) {
  const [query, setQuery] = useState("");

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const filteredChoice =
    query === ""
      ? choice
      : choice.filter((option: string) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selectedOption} onChange={setSelectedOption}>
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-neutral-700 py-1.5 pl-3 pr-10 text-neutral-200 shadow-sm ring-1 ring-inset ring-neutral-600 focus:ring-2 focus:ring-inset focus:ring-neutral-400 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-neutral-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredChoice.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-neutral-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredChoice.map((option) => (
              <Combobox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none text-neutral-200 py-2 pl-3 pr-9",
                    active ? "bg-neutral-600 text-white" : ""
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected ? "font-semibold" : ""
                      )}
                    >
                      {option}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-neutral-400"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

export default Dropdown;
