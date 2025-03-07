'use client';

import { useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

export default function BulkActions({ selectedCount, actions }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  if (selectedCount === 0) return null;

  const handleActionClick = (action, event) => {
    if (action.type === 'dropdown') {
      event.stopPropagation();
      setOpenDropdown(openDropdown === action.key ? null : action.key);
    } else {
      // Add safety check
      if (typeof action.onAction === 'function') {
        action.onAction();
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg dark:shadow-gray-900 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200 z-50">
      <span className="text-sm dark:text-gray-300">
        {selectedCount} selected
      </span>
      <div className="flex gap-2">
        {actions.map((action, index) => (
          <div key={index} className="relative">
            <button
              onClick={(e) => handleActionClick(action, e)}
              className={`px-3 py-1 text-sm rounded transition-colors duration-200 flex items-center ${
                action.variant === 'danger'
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40'
              } ${action.type === 'dropdown' ? 'pr-2' : ''}`}
            >
              {action.label}
              {action.type === 'dropdown' && (
                <ChevronUpDownIcon className="h-4 w-4 ml-2 dark:text-blue-400" />
              )}
            </button>

            {action.type === 'dropdown' && openDropdown === action.key && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900 py-1 z-10">
                {action.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      option.onSelect();
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      option.variant === 'danger'
                        ? 'text-red-600 dark:text-red-400'
                        : 'dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}