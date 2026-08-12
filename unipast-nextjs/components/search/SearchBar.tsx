'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search courses...' }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const debouncedSearch = useDebounce(value, 300);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      // In a real app, fetch from API
      // For now, just show mock suggestions
      setSuggestions([
        { code: 'CSC2101', name: 'Database Systems' },
        { code: 'CSC1101', name: 'Programming I' },
        { code: 'BIT2202', name: 'Web Development' },
      ].filter(item => 
        item.code.includes(debouncedSearch.toUpperCase()) || 
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [debouncedSearch]);

  const handleSelect = (courseCode: string) => {
    router.push(`/papers?search=${courseCode}`);
    setIsOpen(false);
    onChange('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/papers?search=${value}`);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input-field w-full pl-12 pr-4 py-3 text-base"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
            🔍
          </span>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion.code)}
              className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-slate-700 last:border-0 transition-colors"
            >
              <div className="font-semibold text-makerere-maroon">{suggestion.code}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{suggestion.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
