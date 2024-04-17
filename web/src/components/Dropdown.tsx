import {useState } from 'react'
import { Combobox } from '@headlessui/react'

interface Options {
    optionName: string;
  }
interface DropdownProps {
    choice: string[]; 
    onSelect: (selectedOption: Options)=> void
  }  

function Dropdown({choice, onSelect}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState(choice[0] || '')
  const [query, setQuery] = useState('')

  const handleSelect = (option: Options) => {
    setSelectedOption(option.optionName);
    onSelect(option); 
  };

  const filteredChoice =
    query === ''
      ? choice
      : choice.filter((option: string) => {
          return option.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox value={selectedOption} onChange={setSelectedOption}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
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