'use client';

import { createContext, useContext, useState } from 'react';
import { api, VideoProcessingResult } from '../services/api';

interface Video {
  url: string;
  id: string;
  processingResult?: VideoProcessingResult;
}

interface VideoContextType {
  videos: Video[];
  addVideo: (file: File) => Promise<void>;
  getVideo: (id: string) => Video | undefined;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);

  const addVideo = async (file: File) => {
    try {
      // Create a local URL for the video file
      const url = URL.createObjectURL(file);
      
      // Process the video with the backend
      const result = await api.processVideo(file);
      
      // Add the video to the state with its processing results
      setVideos((prev) => [...prev, {
        url,
        id: result.video_id,
        processingResult: result,
      }]);
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    }
  };

  const getVideo = (id: string) => {
    return videos.find((video) => video.id === id);
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, getVideo }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
} 