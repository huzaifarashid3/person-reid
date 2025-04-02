'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useVideoContext } from '../context/VideoContext';

export default function GalleryPage() {
  const { videos, addVideo } = useVideoContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(addVideo);
  }, [addVideo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Video Gallery</h1>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center rounded-lg cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the videos here ...</p>
        ) : (
          <p>Drag & drop videos here, or click to select files</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border rounded-lg p-4">
            <video
              src={video.url}
              controls
              className="w-full h-48 object-cover rounded"
            />
            <p className="mt-2 text-sm text-gray-600">{video.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 