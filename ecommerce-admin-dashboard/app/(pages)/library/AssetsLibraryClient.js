"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import {
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  FilmIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useRouter, usePathname } from 'next/navigation';
import { deleteAssets, uploadAsset, getAssets } from '@/lib/assets';
import ImageUploadWithMetadata from '../../../components/ImageUploadWithMetadata';
import Link from 'next/link';

const AssetsLibraryClient = ({ 
  initialAssets, 
  initialPagination, 
  initialSearch 
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [assets, setAssets] = useState(initialAssets);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      params.delete('cursor'); // Reset pagination on new search
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router]);
    
  // Load more assets
  const loadMore = async () => {
    if (!pagination.next_cursor || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const data = await getAssets(pagination.next_cursor, searchQuery);
      
      setAssets(prev => [...prev, ...data.resources]);
      setPagination({
        next_cursor: data.next_cursor,
        total: data.total_count
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle file upload
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadAsset(file));
      const results = await Promise.all(uploadPromises);
      setAssets(prev => [...results, ...prev]);
    } finally {
      setUploading(false);
    }
  };

  // Delete selected assets
  const handleDelete = async () => {
    if (!selectedAssets.length) return;
    
    try {
      await deleteAssets(selectedAssets);
      setAssets(prev => prev.filter(a => !selectedAssets.includes(a.public_id)));
      setSelectedAssets([]);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats and Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {pagination.total} items · {selectedAssets.length} selected
        </div>
        {selectedAssets.length > 0 && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Delete Selected</span>
          </button>
        )}
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {assets.map((asset, index) => (
            <AssetCard
              key={index}
              asset={asset}
              selected={selectedAssets.includes(asset.public_id)}
              onSelect={() => setSelectedAsset(asset)}
              onToggleSelect={() => {
                setSelectedAssets(prev =>
                  prev.includes(asset.public_id)
                    ? prev.filter(id => id !== asset.public_id)
                    : [...prev, asset.public_id]
                );
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.next_cursor && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* Asset Modal */}
      {selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}

      {/* Uploading Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Uploading files...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Separate component for Asset Card
const AssetCard = ({ asset, selected, onSelect, onToggleSelect }) => (
  <div
    className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onSelect}
  >
    <div className="absolute top-2 left-2 z-10">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
    </div>

    {asset.resource_type === 'image' ? (
      <CldImage
        width={asset.width}
        height={asset.height}
        src={asset.public_id}
        alt="Uploaded asset"
        className="w-full h-48 object-cover"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
    ) : (
      <div className="relative h-48 bg-gray-100">
        <FilmIcon className="h-16 w-16 text-white absolute inset-0 m-auto" />
        <video className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
          <source src={asset.secure_url} type="video/mp4" />
        </video>
      </div>
    )}

    <div className="p-2 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 text-sm mb-1">
        {asset.resource_type === 'image' ? (
          <PhotoIcon className="h-4 w-4 text-blue-500" />
        ) : (
          <FilmIcon className="h-4 w-4 text-purple-500" />
        )}
        <span className="font-medium truncate">{asset.title ? asset.title : asset?.public_id?.split('/').pop()}</span>
      </div>
      <div className="text-xs text-gray-500">
        {asset.format.toUpperCase()} · {Math.round(asset.bytes / 1024)}KB ·{' '}
        {asset.resource_type === 'image' && `${asset.width}x${asset.height}`}
      </div>
    </div>
  </div>
);

// Separate component for Asset Modal
const AssetModal = ({ asset, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
      <button
        onClick={onClose}
        className="absolute -right-3 -top-3 z-[100] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
      >
        <XMarkIcon className="h-6 w-6 text-gray-700" />
      </button>

      <div className="relative h-full">
        {asset.resource_type === 'image' ? (
          <CldImage
            width={asset.width}
            height={asset.height}
            src={asset.public_id}
            alt="Full size preview"
            className="object-contain h-[70vh] w-full"
          />
        ) : (
          <video 
            controls 
            autoPlay
            className="max-h-[70vh] w-auto mx-auto"
          >
            <source src={asset.secure_url} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Type</p>
            <p>{asset.resource_type}</p>
          </div>
          <div>
            <p className="text-gray-500">Dimensions</p>
            <p>{asset.width}x{asset.height}</p>
          </div>
          <div>
            <p className="text-gray-500">Size</p>
            <p>{Math.round(asset.bytes / 1024)}KB</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AssetsLibraryClient;