'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export interface SelectOption {
  id: string;
  label: string;
  value: string;
  [key: string]: unknown;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string, option?: SelectOption) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  required = false,
  error,
  isLoading = false,
  disabled = false,
  className,
  onSearch,
  searchPlaceholder = 'Search...',
  noOptionsMessage = 'No options found',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    if (debouncedSearchQuery.trim() && onSearch) onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearchQuery.trim() || onSearch) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [debouncedSearchQuery, onSearch, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option.id, option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', undefined);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          'relative w-full cursor-pointer',
          disabled && 'opacity-60 cursor-not-allowed',
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div
          className={cn(
            'flex min-h-12 w-full items-center justify-between rounded-xl border bg-[#F8FAFC] px-4 py-3 transition-all duration-150',
            error
              ? 'border-red-500 bg-red-50/30'
              : isOpen
                ? 'border-[#2563EB] bg-white ring-4 ring-[#2563EB]/10'
                : 'border-slate-200 hover:border-slate-300',
            disabled && 'bg-slate-50 cursor-not-allowed',
          )}
        >
          {selectedOption ? (
            <span className="truncate text-sm font-medium text-[#0B1020]">
              {selectedOption.label}
            </span>
          ) : (
            <span className="truncate pr-2 text-sm font-medium text-[#9aabbf]">
              {placeholder}
            </span>
          )}

          <div className="flex items-center gap-1 flex-shrink-0">
            {selectedOption && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'w-5 h-5 text-slate-400 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 pl-1 mt-1">{error}</p>}

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Search */}
          <div className="relative p-2 border-b border-slate-100">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#F8FAFC] rounded-lg border border-slate-200 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-sm text-slate-500">Loading...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-400">
                {noOptionsMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[#f0f4ff]',
                    option.id === value && 'bg-[#EFF6FF] text-[#2563EB] font-medium',
                  )}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
