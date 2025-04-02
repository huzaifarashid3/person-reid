'use client';

import { useState } from 'react';
import { useVideoContext } from '../context/VideoContext';
import { useTargetContext } from '../context/TargetContext';
import { SearchResult } from '../services/api';

interface Match {
  frame_idx: number;
  similarity: number;
  frame_path: string;
}

export default function ResultsPage() {
  const { videos } = useVideoContext();
  const { targets, searchTargets, searchResults } = useTargetContext();
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (selectedVideos.length === 0 || selectedTargets.length === 0) {
      alert('Please select at least one video and one target');
      return;
    }

    setIsSearching(true);
    try {
      await searchTargets(selectedVideos, selectedTargets);
    } catch (error) {
      console.error('Error searching targets:', error);
      alert('Error searching targets. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleVideo = (videoId: string) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const toggleTarget = (targetId: string) => {
    setSelectedTargets((prev) =>
      prev.includes(targetId)
        ? prev.filter((id) => id !== targetId)
        : [...prev, targetId]
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Videos</h2>
          <div className="space-y-2">
            {videos.map((video) => (
              <label key={video.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedVideos.includes(video.id)}
                  onChange={() => toggleVideo(video.id)}
                  className="rounded text-blue-500"
                />
                <span>{video.id}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Target Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Targets</h2>
          <div className="space-y-2">
            {targets.map((target) => (
              <label key={target.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTargets.includes(target.id)}
                  onChange={() => toggleTarget(target.id)}
                  className="rounded text-blue-500"
                />
                <span>{target.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className={`px-6 py-2 rounded ${
            isSearching
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results Display */}
      {Object.entries(searchResults).length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Results</h2>
          {Object.entries(searchResults as SearchResult).map(([videoId, videoResults]) => (
            <div key={videoId} className="space-y-4">
              <h3 className="font-medium">Video: {videoId}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(videoResults).map(([targetId, matches]) => (
                  <div key={targetId} className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">
                      Target: {targets.find((t) => t.backendId === targetId)?.name}
                    </h4>
                    <div className="space-y-2">
                      {(matches as Match[]).map((match, index) => (
                        <div key={index} className="text-sm">
                          <p>Frame: {match.frame_idx}</p>
                          <p>Similarity: {(match.similarity * 100).toFixed(1)}%</p>
                          <img
                            src={`http://localhost:5000/processed/${match.frame_path}`}
                            alt={`Match at frame ${match.frame_idx}`}
                            className="mt-2 w-full h-48 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 