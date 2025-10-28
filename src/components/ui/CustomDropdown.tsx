'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { CustomDropdownProps, DropdownOption } from '@/types/ui.types';

export const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 flex items-center justify-between',
          isOpen && 'ring-2 ring-yellow-500 border-yellow-500'
        )}
      >
        <span className={clsx(selectedOption ? 'text-white' : 'text-gray-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-yellow-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-2xl overflow-hidden'>
          <div className='py-1'>
            {options.map((option: DropdownOption, index: number) => (
              <button
                key={`${option.value}-${index}`}
                type='button'
                onClick={() => handleOptionClick(option.value)}
                className={clsx(
                  'w-full px-3 py-2 text-left text-sm transition-colors duration-200 flex items-center justify-between',
                  option.value === value
                    ? 'bg-linear-to-r from-yellow-500/20 to-red-500/20 text-yellow-300'
                    : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                )}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className='w-4 h-4 text-yellow-400' />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
