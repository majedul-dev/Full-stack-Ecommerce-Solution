// "use client"
// import axios from "axios";
// import { useEffect, useState } from "react";

// const AssetLibrary = ({ onSelect, onClose }) => {
//   const [assets, setAssets] = useState([]);

//   useEffect(() => {
//     async function fetchAsset() {
//       const res = await axios.get("https://8080-mazedul956-ecommercesol-vh0txgc5lvq.ws-us117.gitpod.io/api/assets")
//       const data = res.data
//       setAssets(data.data.resources)
//     }
//     fetchAsset()
//   }, []);

//   console.log(assets)

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
//         <h2 className="text-lg font-semibold mb-4">Select an Image</h2>
//         <div className="grid grid-cols-3 gap-4">
//           {assets?.map((image) => (
//             <img
//               key={image.asset_id}
//               src={image.secure_url}
//               alt="Asset"
//               className="h-24 w-full object-cover cursor-pointer hover:opacity-75"
//               onClick={() => onSelect(image.secure_url)}
//             />
//           ))}
//         </div>
//         <button onClick={onClose} className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AssetLibrary;

"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";

export default function AssetLibrary({ isOpen, onClose, onSelect }) {
  const [selected, setSelected] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function fetchAsset() {
      const res = await axios.get("https://8080-mazedul956-ecommercesol-vh0txgc5lvq.ws-us118.gitpod.io/api/assets");
      const data = res.data;
      setAssets(data.data.resources);
    }
    fetchAsset();
  }, []);

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
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-50">
          <h2 className="text-lg font-semibold">Asset Library</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Close
          </button>
        </div>

        {/* Asset Grid */}
        <div className="flex-1 min-h-0 overflow-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-0">
            {assets?.map((asset) => (
              <div
                key={asset.asset_id}
                className={`relative group border-2 rounded-lg cursor-pointer overflow-hidden ${
                  selected.includes(asset.asset_id)
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  toggleSelect(asset.asset_id)
                  onSelect(asset.secure_url)
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
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between items-center">
          <span className="text-gray-600">
            {selected.length} {selected.length === 1 ? "item" : "items"} selected
          </span>
          <button
            onClick={() => {
              onClose()
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