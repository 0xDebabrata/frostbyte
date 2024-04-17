import {Dispatch, SetStateAction, useState } from 'react'
import { Combobox } from '@headlessui/react'

interface DropdownProps {
  choice: string[]; 
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
}  

function Dropdown({
  choice,
  selectedOption,
  setSelectedOption
}: DropdownProps) {
  const [query, setQuery] = useState('')

  const filteredChoice =
    query === ''
      ? choice
      : choice.filter((option: string) => {
          return option.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox value={selectedOption} onChange={setSelectedOption}>
      <Combobox.Input
        onChange={(event) => setQuery(event.target.value)}
        className="text-black"
      />
      <Combobox.Options>
        {filteredChoice.map((option:string) => (
          <Combobox.Option key={option} value={option}>
            {option}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}

export default Dropdown;
