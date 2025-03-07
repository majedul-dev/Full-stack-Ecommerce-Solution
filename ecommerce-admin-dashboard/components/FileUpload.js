import { useState } from "react";

// components/ui/FileUpload.js
export const FileUpload = ({ onFileUpload }) => {
    const [preview, setPreview] = useState(null);
  
    const handleFile = (file) => {
      // Upload logic
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    };
  
    return (
      <div className="border-2 border-dashed rounded-lg p-4">
        {preview && <img src={preview} className="mb-4 max-h-32" alt="Preview" />}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    );
  };