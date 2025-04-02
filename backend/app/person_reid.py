import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import os
from transformers import CLIPProcessor, CLIPModel
import numpy as np
from .config import Config

class PersonReID:
    def __init__(self):
        # Initialize CLIP model for text-to-image matching
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        # Initialize image model for image-to-image matching
        # You would typically use a specialized person ReID model here
        # For this example, we'll use CLIP's image encoder
        self.image_model = self.clip_model.vision_model
        
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.clip_model.to(self.device)
        self.image_model.to(self.device)
        
        self.targets = {}
        self.results_cache = {}

    def _process_image(self, image_path):
        image = Image.open(image_path).convert('RGB')
        inputs = self.clip_processor(images=image, return_tensors="pt")
        return inputs.pixel_values.to(self.device)

    def _process_text(self, text):
        inputs = self.clip_processor(text=text, return_tensors="pt", padding=True)
        return inputs.input_ids.to(self.device)

    def add_text_target(self, text, name):
        target_id = f"text_{len(self.targets)}"
        
        # Process text and get embeddings
        text_tensor = self._process_text(text)
        with torch.no_grad():
            embeddings = self.clip_model.get_text_features(text_tensor)

        self.targets[target_id] = {
            'type': 'text',
            'data': text,
            'name': name,
            'embeddings': embeddings
        }
        
        return target_id

    def add_image_target(self, image_file, name):
        target_id = f"image_{len(self.targets)}"
        
        # Save the uploaded image temporarily
        temp_path = os.path.join(Config.TEMP_FOLDER, f"{target_id}.jpg")
        image_file.save(temp_path)
        
        try:
            # Process image and get embeddings
            image_tensor = self._process_image(temp_path)
            with torch.no_grad():
                embeddings = self.image_model(image_tensor).pooler_output

            self.targets[target_id] = {
                'type': 'image',
                'data': temp_path,  # Store the path to the saved image
                'name': name,
                'embeddings': embeddings
            }
            
            return target_id
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def search_targets(self, video_ids, target_ids):
        results = {}
        
        for video_id in video_ids:
            video_results = {}
            frames_path = os.path.join(Config.PROCESSED_FOLDER, video_id)
            
            for target_id in target_ids:
                target = self.targets[target_id]
                target_embeddings = target['embeddings']
                
                frame_matches = []
                
                # Process each frame in the video's processed folder
                for frame_file in os.listdir(frames_path):
                    if frame_file.endswith('.jpg'):
                        frame_path = os.path.join(frames_path, frame_file)
                        frame_tensor = self._process_image(frame_path)
                        
                        with torch.no_grad():
                            frame_embeddings = self.image_model(frame_tensor).pooler_output
                            
                            # Calculate similarity
                            similarity = F.cosine_similarity(
                                target_embeddings,
                                frame_embeddings
                            ).item()
                            
                            if similarity > 0.7:  # Threshold for matching
                                frame_idx = int(frame_file.split('_frame_')[1].split('.')[0])
                                frame_matches.append({
                                    'frame_idx': frame_idx,
                                    'similarity': similarity,
                                    'frame_path': frame_file
                                })
                
                if frame_matches:
                    # Sort matches by similarity
                    frame_matches.sort(key=lambda x: x['similarity'], reverse=True)
                    video_results[target_id] = frame_matches
            
            if video_results:
                results[video_id] = video_results
                self.results_cache[f"{video_id}_{target_id}"] = video_results
        
        return results

    def get_results(self, video_id, target_id):
        cache_key = f"{video_id}_{target_id}"
        return self.results_cache.get(cache_key, {}) 