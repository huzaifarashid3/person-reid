'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTargetContext } from '../context/TargetContext';
import Link from 'next/link';

export default function TargetsPage() {
  const { targets, addTextTarget, addImageTarget, updateTarget, deleteTarget } = useTargetContext();
  const [currentDescription, setCurrentDescription] = useState('');
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [droppedImage, setDroppedImage] = useState<{ file: File; url: string } | null>(null);
  const [imageTargetName, setImageTargetName] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDroppedImage({
        file: acceptedFiles[0],
        url: URL.createObjectURL(acceptedFiles[0])
      });
    }
  }, []);

  const handleSaveImageTarget = () => {
    if (droppedImage && imageTargetName.trim()) {
      addImageTarget(imageTargetName.trim(), droppedImage.url);
      setDroppedImage(null);
      setImageTargetName('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentDescription.trim()) {
      e.preventDefault();
      addTextTarget('Text Target', currentDescription.trim());
      setCurrentDescription('');
    }
  };

  const startEditing = (target: { id: string; name: string }) => {
    setEditingTarget(target.id);
    setEditName(target.name);
  };

  const saveEdit = () => {
    if (editingTarget && editName.trim()) {
      updateTarget(editingTarget, { name: editName.trim() });
      setEditingTarget(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Target Management</h1>
        <div className="space-x-4">
          <Link
            href="/prompt"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Text Target
          </Link>
          <Link
            href="/cropper"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Image Target
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quick Add Text Target
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Type a description and press Enter to add text target..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Add Image Target
          </label>
          {!droppedImage ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center rounded-lg cursor-pointer
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag & drop an image here to add image target, or click to select</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg">
              <img
                src={droppedImage.url}
                alt="Dropped image"
                className="w-full h-48 object-cover rounded"
              />
              <div className="space-y-2">
                <input
                  type="text"
                  value={imageTargetName}
                  onChange={(e) => setImageTargetName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter a name for this target..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveImageTarget}
                    disabled={!imageTargetName.trim()}
                    className={`flex-1 px-4 py-2 rounded ${
                      imageTargetName.trim()
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-white'
                    }`}
                  >
                    Save Target
                  </button>
                  <button
                    onClick={() => {
                      setDroppedImage(null);
                      setImageTargetName('');
                    }}
                    className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targets.map((target) => (
          <div key={target.id} className="border rounded-lg p-4 space-y-2">
            {editingTarget === target.id ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter name..."
                />
                <button
                  onClick={saveEdit}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTarget(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{target.name || 'Unnamed Target'}</h3>
                <button
                  onClick={() => startEditing(target)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Rename
                </button>
              </div>
            )}
            
            {target.imageUrl ? (
              <img
                src={target.imageUrl}
                alt={target.description}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Text Target</span>
              </div>
            )}
            
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                • {target.description}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => deleteTarget(target.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 