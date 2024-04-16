'use client'
import {Fragment,useState } from 'react'
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
interface Person {
    id: number;
    name: string;
  }
interface DropdownProps {
    people: string[]; 
  }  

function Dropdown({people}: DropdownProps) {
  const [selectedPerson, setSelectedPerson] = useState(people[0] || '')
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person: string) => {
          return person.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
      <Combobox.Options>
        {filteredPeople.map((person :string) => (
          <Combobox.Option key={person} value={person}>
            {person}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}

export default Dropdown;