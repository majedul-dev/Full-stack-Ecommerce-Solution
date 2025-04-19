import PageHeader from '@/components/PageHeader';
import AssetsLibraryClient from './AssetsLibraryClient';
import { getAssets } from '@/lib/assets';
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default async function AssetsLibrary(searchParamsPromise) {
  const searchParams = await searchParamsPromise;
  const cursor = searchParams.cursor || '';
  const search = searchParams.search || '';
  
  const data = await getAssets(cursor, search);

  return (
    <div>
      <PageHeader title="Assets Library" actionHref="/library/upload" actionText="Upload New" Icon={ArrowUpTrayIcon}/>
      <AssetsLibraryClient 
        initialAssets={data.resources} 
        initialPagination={{
          next_cursor: data.next_cursor,
          total: data.total_count
        }}
        initialSearch={search}
      />
    </div>
  );
}


// "use client";
// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { CldImage } from 'next-cloudinary';
// import {
//   MagnifyingGlassIcon,
//   ArrowUpTrayIcon,
//   FilmIcon,
//   PhotoIcon,
//   TrashIcon,
//   XMarkIcon,
//   ArrowPathIcon
// } from "@heroicons/react/24/outline";
// import axios from 'axios';

// const AssetsLibrary = () => {
//   const { data: session } = useSession();
//   const [assets, setAssets] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedAssets, setSelectedAssets] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [pagination, setPagination] = useState({ next_cursor: '', total: 0 });
//   const [selectedAsset, setSelectedAsset] = useState(null);

//   // Fetch assets from Cloudinary
//   const fetchAssets = async (cursor) => {
//     try {
//       const res = await fetch(`https://8080-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io/api/assets?cursor=${cursor || ''}&search=${searchQuery}`);
//       const { data, total_count } = await res.json();
//       setAssets(prev => cursor ? [...prev, ...data.resources] : data.resources);
//       setPagination({ next_cursor: data.next_cursor, total: total_count });
//     } catch (error) {
//       console.error('Error fetching assets:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, [searchQuery]);

//   // Handle file upload
//   const handleUpload = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     setUploading(true);
//     try {
//       const uploadPromises = files.map(file => {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        
//         return fetch(
//           `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, 
//           { method: 'POST', body: formData }
//         ).then(res => res.json());
//       });

//       const results = await Promise.all(uploadPromises);
//       setAssets(prev => [...results, ...prev]);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Delete selected assets
//   const deleteAssets = async () => {
//     if (!selectedAssets.length) return;
    
//     try {
//       const response = await axios.delete(`https://8080-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io/api/assets`, {
//         data: { public_ids: selectedAssets }
//       });
  
//       if (response.status === 200) {
//         setAssets(prev => prev.filter(a => !selectedAssets.includes(a.public_id)));
//         setSelectedAssets([]);
//         // Optional: Add toast notification
//         console.log('Assets deleted successfully:', response.data);
//       }
//     } catch (error) {
//       console.error('Delete error:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
//     }
//   };

//   console.log(selectedAssets)

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold">Assets Library</h1>
        
//         <div className="flex items-center gap-4 w-full sm:w-auto">
//           <div className="relative flex-1">
//             <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search assets..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
//             <ArrowUpTrayIcon className="h-5 w-5" />
//             <span>Upload</span>
//             <input
//               type="file"
//               multiple
//               onChange={handleUpload}
//               className="hidden"
//               accept="image/*,video/*"
//             />
//           </label>
//         </div>
//       </div>

//       {/* Stats and Actions */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="text-sm text-gray-600">
//           {pagination.total} items · {selectedAssets.length} selected
//         </div>
//         {selectedAssets.length > 0 && (
//           <button
//             onClick={deleteAssets}
//             className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
//           >
//             <TrashIcon className="h-5 w-5" />
//             <span>Delete Selected</span>
//           </button>
//         )}
//       </div>

//       {/* Asset Grid */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//           {assets.map((asset, index) => (
//             <div
//               key={index}
//               className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//               onClick={(e) => {
//                 // Only open modal if not clicking on checkbox
//                 if (!e.target.closest('input[type="checkbox"]')) {
//                   setSelectedAsset(asset);
//                 }
//               }}
//             >
//               <div className="absolute top-2 left-2 z-10">
//                 <input
//                   type="checkbox"
//                   checked={selectedAssets.includes(asset.public_id)}
//                   onChange={(e) => {
//                     e.stopPropagation();
//                     setSelectedAssets(prev =>
//                       e.target.checked
//                         ? [...prev, asset.public_id]
//                         : prev.filter(id => id !== asset.public_id)
//                     );
//                   }}
//                   onClick={(e) => e.stopPropagation()}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                 />
//               </div>

//               {asset.resource_type === 'image' ? (
//                 <CldImage
//                   width={asset.width}
//                   height={asset.height}
//                   src={asset.public_id}
//                   alt="Uploaded asset"
//                   className="w-full h-48 object-cover"
//                   sizes="(max-width: 768px) 100vw, 25vw"
//                 />
//               ) : (
//                 <div className="relative h-48 bg-gray-100">
//                   <FilmIcon className="h-16 w-16 text-white absolute inset-0 m-auto" />
//                   <video className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
//                     <source src={asset.secure_url} type="video/mp4" />
//                   </video>
//                 </div>
//               )}

//               <div className="p-2 bg-white dark:bg-gray-800">
//                 <div className="flex items-center gap-2 text-sm mb-1">
//                   {asset.resource_type === 'image' ? (
//                     <PhotoIcon className="h-4 w-4 text-blue-500" />
//                   ) : (
//                     <FilmIcon className="h-4 w-4 text-purple-500" />
//                   )}
//                   <span className="font-medium truncate">{asset.public_id.split('/').pop()}</span>
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {asset.format.toUpperCase()} · {Math.round(asset.bytes / 1024)}KB ·{' '}
//                   {asset.resource_type === 'image' && `${asset.width}x${asset.height}`}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination.next_cursor && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => fetchAssets(pagination.next_cursor)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Load More
//           </button>
//         </div>
//       )}

//       {/* Asset Modal */}
//       {selectedAsset && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
//             <button
//               onClick={() => setSelectedAsset(null)}
//               className="absolute -right-3 -top-3 z-[100] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
//             >
//               <XMarkIcon className="h-6 w-6 text-gray-700" />
//             </button>

//             <div className="relative h-full">
//               {selectedAsset.resource_type === 'image' ? (
//                 <CldImage
//                   width={selectedAsset.width}
//                   height={selectedAsset.height}
//                   src={selectedAsset.public_id}
//                   alt="Full size preview"
//                   className="object-contain h-[70vh] w-full"
//                 />
//               ) : (
//                 <video 
//                   controls 
//                   autoPlay
//                   className="max-h-[70vh] w-auto mx-auto"
//                 >
//                   <source src={selectedAsset.secure_url} type="video/mp4" />
//                 </video>
//               )}
//             </div>

//             <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t">
//               <div className="grid grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <p className="text-gray-500">Type</p>
//                   <p>{selectedAsset.resource_type}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Dimensions</p>
//                   <p>{selectedAsset.width}x{selectedAsset.height}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Size</p>
//                   <p>{Math.round(selectedAsset.bytes / 1024)}KB</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Uploading Overlay */}
//       {uploading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg text-center">
//             <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
//             <p>Uploading files...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssetsLibrary;