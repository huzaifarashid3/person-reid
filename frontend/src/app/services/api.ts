import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface VideoProcessingResult {
  video_id: string;
  total_frames: number;
  fps: number;
  frames_with_detections: {
    frame_idx: number;
    timestamp: number;
    filename: string;
    detections: {
      box: number[];
      score: number;
    }[];
  }[];
}

export interface SearchResult {
  [videoId: string]: {
    [targetId: string]: {
      frame_idx: number;
      similarity: number;
      frame_path: string;
    }[];
  };
}

export const api = {
  async processVideo(file: File): Promise<VideoProcessingResult> {
    const formData = new FormData();
    formData.append('video', file);

    const response = await axios.post(`${API_BASE_URL}/process-video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async addTextTarget(text: string, name: string): Promise<{ target_id: string }> {
    const response = await axios.post(`${API_BASE_URL}/add-text-target`, {
      text,
      name,
    });
    return response.data;
  },

  async addImageTarget(imageData: string, name: string): Promise<{ target_id: string }> {
    // Convert base64 image data to blob
    const imageResponse = await fetch(imageData);
    const blob = await imageResponse.blob();
    
    const formData = new FormData();
    formData.append('image', blob);
    formData.append('name', name);

    const response = await axios.post(`${API_BASE_URL}/add-image-target`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async searchTargets(videoIds: string[], targetIds: string[]): Promise<SearchResult> {
    const response = await axios.post(`${API_BASE_URL}/search-targets`, {
      video_ids: videoIds,
      target_ids: targetIds,
    });
    return response.data;
  },

  async getResults(videoId: string, targetId: string): Promise<SearchResult> {
    const response = await axios.get(`${API_BASE_URL}/get-results/${videoId}/${targetId}`);
    return response.data;
  },
}; 