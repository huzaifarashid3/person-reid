'use client';

import { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useVideoContext } from '../context/VideoContext';
import { useTargetContext } from '../context/TargetContext';

interface CroppedImage {
  id: string;
  url: string;
  timestamp: number;
}

export default function CropperPage() {
  const { videos } = useVideoContext();
  const { addImageTarget } = useTargetContext();
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
  const [capturedFrame, setCapturedFrame] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const cropperRef = useRef<any>(null);
  const [isCropperReady, setIsCropperReady] = useState(false);
  const [targetName, setTargetName] = useState('');

  const handleVideoSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVideo(event.target.value);
    setCapturedFrame('');
    setIsCropperReady(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
      setCapturedFrame('');
      setIsCropperReady(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameUrl = canvas.toDataURL('image/jpeg');
        setCapturedFrame(frameUrl);
        setIsCropperReady(false);
      }
    }
  };

  const handleCrop = () => {
    if (cropperRef.current && isCropperReady) {
      try {
        const canvas = cropperRef.current.cropper.getCroppedCanvas();
        const croppedUrl = canvas.toDataURL('image/jpeg');
        const timestamp = videoRef.current?.currentTime || 0;
        
        const newCroppedImage = {
          id: Math.random().toString(36).substring(2, 11),
          url: croppedUrl,
          timestamp: timestamp,
        };
        
        setCroppedImages((prev) => [...prev, newCroppedImage]);
        setCapturedFrame('');
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }
  };

  const saveToTargets = (image: CroppedImage) => {
    if (targetName.trim()) {
      addImageTarget(targetName.trim(), image.url);
      setTargetName('');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Target Cropper</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Video
          </label>
          <select
            value={selectedVideo}
            onChange={handleVideoSelect}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a video...</option>
            {videos.map((video) => (
              <option key={video.url} value={video.url}>
                {video.url}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload New Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {selectedVideo && (
          <div className="space-y-4">
            <div className="space-y-2">
              <video
                ref={videoRef}
                src={selectedVideo}
                controls
                className="w-full max-h-96"
              />
              <div className="flex justify-center">
                <button
                  onClick={captureFrame}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Capture Current Frame
                </button>
              </div>
            </div>

            {capturedFrame && (
              <div className="space-y-4">
                <div className="h-[400px]">
                  <Cropper
                    ref={cropperRef}
                    src={capturedFrame}
                    style={{ height: '100%', width: '100%' }}
                    aspectRatio={NaN}
                    viewMode={1}
                    dragMode="move"
                    autoCropArea={1}
                    restore={false}
                    guides={true}
                    center={true}
                    highlight={false}
                    cropBoxMovable={true}
                    cropBoxResizable={true}
                    toggleDragModeOnDblclick={true}
                    ready={() => setIsCropperReady(true)}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleCrop}
                    disabled={!isCropperReady}
                    className={`px-4 py-2 rounded ${
                      isCropperReady
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-white'
                    }`}
                  >
                    Crop Current Frame
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {croppedImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Cropped Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {croppedImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-2">
                  <img
                    src={image.url}
                    alt={`Cropped at ${image.timestamp.toFixed(2)}s`}
                    className="w-full h-48 object-cover rounded"
                  />
                  <p className="text-sm text-gray-600">
                    Time: {image.timestamp.toFixed(2)}s
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={targetName}
                      onChange={(e) => setTargetName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter a name for this target..."
                    />
                    <button
                      onClick={() => saveToTargets(image)}
                      disabled={!targetName.trim()}
                      className={`w-full px-4 py-2 rounded ${
                        targetName.trim()
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-400 cursor-not-allowed text-white'
                      }`}
                    >
                      Add to Targets
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 