'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function TreeSelect({ options, onChange, value }) {
  const [expanded, setExpanded] = useState(new Set());
  const [open, setOpen] = useState(false);

  // Build hierarchical categories
  const buildTree = (items) => {
    const map = new Map();
    const roots = [];

    items?.forEach((item) => map.set(item._id, { ...item, children: [] }));
    items?.forEach((item) => {
      if (item.path) {
        const parentId = item.path.split('/').pop();
        const parent = map.get(parentId);
        if (parent) {
          parent.children.push(map.get(item._id));
        }
      } else {
        roots.push(map.get(item._id));
      }
    });

    return roots;
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleSelect = (category) => {
    onChange(category ? category._id : null);
    setOpen(false);
  };

  const renderOptions = (items) =>
    items?.map((item) => (
      <div key={item._id}>
        <div
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSelect(item);
          }}
        >
          {item.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault(); 
                toggleExpand(item._id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {expanded.has(item._id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <span>{item.name}</span>
        </div>
        {item.children.length > 0 && expanded.has(item._id) && (
          <div className="pl-4">{renderOptions(item.children)}</div>
        )}
      </div>
    ));

  const treeData = buildTree(options);
  const selectedCategory = options?.find((c) => c._id === value);

  return (
    <div>
      <div
        className="border p-2 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {selectedCategory ? selectedCategory.name : 'Root Category'}
        <ChevronDown className="h-4 w-4" />
      </div>
      {open && (
        <div
          className="border mt-1 p-2 rounded bg-white shadow"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Root Parent Option */}
          <div
            className="p-2 hover:bg-gray-100 rounded cursor-pointer font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(null);
            }}
          >
            Root Category
          </div>

          {/* Other Categories Below */}
          {renderOptions(treeData)}
        </div>
      )}
    </div>
  );
}