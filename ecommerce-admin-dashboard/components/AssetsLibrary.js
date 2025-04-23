"use client";
import { useEffect, useState } from "react";
import { Check, Search } from "lucide-react";
import axios from "axios";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function AssetLibrary({ isOpen, onClose, onSelect }) {
  const [selected, setSelected] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ next_cursor: '', total: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssets = async (cursor = '', search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://8080-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io/api/assets?cursor=${cursor}&search=${search}`
      );
      const data = res.data;
      setAssets(prev => cursor ? [...prev, ...data.data.resources] : data.data.resources);
      setPagination({ 
        next_cursor: data.data.next_cursor, 
        total: data.total_count 
      });
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Debounce the search to avoid too many requests
      const timer = setTimeout(() => {
        fetchAssets('', searchQuery);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, searchQuery]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b sticky top-0 bg-white z-50">
          <h2 className="text-lg font-semibold">Asset Library</h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by image title.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded whitespace-nowrap"
            >
              Close
            </button>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="flex-1 min-h-0 overflow-auto p-4">
          {/* Stats */}
          <div className="text-sm text-gray-600 mb-4">
            {pagination.total} items · {selected.length} selected
          </div>

          {assets.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              No assets found
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-0">
                {assets?.map((asset, index) => (
                  <div
                    key={index}
                    className={`relative group border-2 rounded-lg cursor-pointer overflow-hidden ${
                      selected.includes(asset.asset_id)
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      toggleSelect(asset.asset_id);
                      onSelect(asset.secure_url);
                    }}
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={asset.secure_url}
                        alt="Asset"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded border-2 ${
                          selected.includes(asset.asset_id)
                            ? "bg-blue-500 border-blue-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {selected.includes(asset.asset_id) && (
                          <Check className="text-white w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-center items-center h-16">
                  <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}

              {/* Load More button */}
              {pagination.next_cursor && !loading && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => fetchAssets(pagination.next_cursor, searchQuery)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between items-center">
          <span className="text-gray-600">
            {selected.length} {selected.length === 1 ? "item" : "items"} selected
          </span>
          <button
            onClick={() => {
              onClose();
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Select Assets
          </button>
        </div>
      </div>
    </div>
  );
}