"use client"

import { TextInput, useField } from "@chatfall/client"
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { CrossSvg, DropdownArrowSvg } from "./Svg"

export interface Option {
  value: string
  label: string
}

export interface SearchableSelectProps {
  options?: Option[]
  placeholder?: string
  onChange?: (selectedOption: Option | null) => void
  selectedOption?: Option
  className?: string
}

export const SearchableSelect: FC<SearchableSelectProps> = ({
  options = [],
  placeholder = "Select an option",
  onChange,
  selectedOption,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const searchField = useField<string>({
    name: "search",
    initialValue: "",
  })
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

  const filteredOptions = useMemo(
    () =>
      options?.filter((option) =>
        option.label
          .toLowerCase()
          .includes((searchField.value || "").toLowerCase()),
      ) ?? [],
    [options, searchField.value],
  )

  const handleSelect = useCallback(
    (option: Option) => {
      setIsOpen(false)
      searchField.handleChange("")
      onChange?.(option)
    },
    [onChange, searchField.handleChange],
  )

  const handleClear = useCallback(() => {
    searchField.handleChange("")
    onChange?.(null)
  }, [onChange, searchField.handleChange])

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <div
        className="flex items-center justify-between w-full p-2 input input-bordered cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center">
          {selectedOption && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="mr-2 text-base-content"
            >
              <CrossSvg className="w-2 h-2 text-base-content" />
            </button>
          )}
          <DropdownArrowSvg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-base-200 border border-base-200 rounded-md shadow-lg max-h-[50vh] overflow-y-auto">
          <TextInput
            field={searchField}
            placeholder="Search..."
            className="m-1"
            inputClassName="w-full"
            hideValidationIndicator={true}
            hideError={true}
          />
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="p-4 cursor-pointer hover:bg-secondary"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="p-4 text-base-300 italic">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
