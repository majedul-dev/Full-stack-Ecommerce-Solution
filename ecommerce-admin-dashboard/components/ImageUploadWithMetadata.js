"use client";
import { useState, useCallback } from 'react';
import { UploadCloud, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImageUploadWithMetadata() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [cloudinaryResult, setCloudinaryResult] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: ''
  });
  const [isDragging, setIsDragging] = useState(false);

  // Native drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploadProgress(0);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      setCloudinaryResult(result);
      setShowMetadataModal(true);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
    }
  };

  const saveMetadata = async () => {
    if (!cloudinaryResult) return;

    try {
      const payload = {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
        title: metadata.title,
        description: metadata.description,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assets/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Image and metadata saved successfully!');
        resetForm();
      } else {
        throw new Error('Failed to save metadata');
      }
    } catch (error) {
      console.error('Error saving metadata:', error);
      alert('Failed to save metadata');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setCloudinaryResult(null);
    setMetadata({ title: '', description: '' });
    setShowMetadataModal(false);
    setUploadProgress(0);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Native Drag and Drop Area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'
          }`}
        >
          <input 
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-3">
            {selectedFile ? (
              <ImageIcon className="w-10 h-10 text-primary" />
            ) : (
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
            )}
            {isDragging ? (
              <p className="text-primary font-medium">Drop the image here</p>
            ) : selectedFile ? (
              <p className="font-medium">Click to change image</p>
            ) : (
              <>
                <p className="font-medium">Drag & drop an image here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPEG, PNG, WEBP (Max 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Upload Button with Progress */}
            <div className="space-y-2">
              <Button
                onClick={uploadToCloudinary}
                disabled={uploadProgress > 0}
                className="w-full"
              >
                {uploadProgress > 0 ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload to Cloudinary'
                )}
              </Button>
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {uploadProgress}% complete
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Metadata Dialog */}
      <Dialog open={showMetadataModal} onOpenChange={setShowMetadataModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Image Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={cloudinaryResult?.secure_url}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg border"
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Public ID</label>
              <Input
                value={cloudinaryResult?.public_id || ''}
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title*</label>
              <Input
                value={metadata.title}
                onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                placeholder="Enter image title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={metadata.description}
                onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                onClick={saveMetadata}
                disabled={!metadata.title}
              >
                Save Metadata
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}