import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface MultiSelectFieldProps {
  fieldName: string;
  options: string[];
  selected: string[];
  placeholder: string;
  hasError?: boolean;
  onToggle: (fieldName: string, value: string, checked: boolean) => void;
}

export function MultiSelectField({
  fieldName,
  options,
  selected,
  placeholder,
  hasError = false,
  onToggle
}: MultiSelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={fieldName}
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
            hasError ? 'border-red-500' : 'border-gray-300'
          )}
        >
          <span className={cn('flex-1 truncate', selected.length === 0 && 'text-gray-500')}>
            {selected.length === 0
              ? placeholder
              : selected.length <= 2
                ? selected.join(', ')
                : `${selected.slice(0, 2).join(', ')} +${selected.length - 2} more`}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No matching option.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => onToggle(fieldName, option, !isSelected)}
                    className="cursor-pointer gap-2"
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded border',
                        isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-300'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                    <span>{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onToggle(fieldName, value, false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </Popover>
  );
}
