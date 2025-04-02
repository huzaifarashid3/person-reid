import cv2
import numpy as np
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F
import os
from .config import Config

class VideoProcessor:
    def __init__(self):
        self.model = fasterrcnn_resnet50_fpn(pretrained=True)
        self.model.eval()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
        # Create necessary directories
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.PROCESSED_FOLDER, exist_ok=True)

    def process_video(self, video_file):
        # Save video file
        video_path = os.path.join(Config.UPLOAD_FOLDER, video_file.filename)
        video_file.save(video_path)

        # Open video
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        frames_data = []
        frame_idx = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Process every 5th frame to reduce computation
            if frame_idx % 5 == 0:
                # Convert BGR to RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Prepare image for model
                image_tensor = F.to_tensor(rgb_frame).to(self.device)
                
                # Get predictions
                with torch.no_grad():
                    predictions = self.model([image_tensor])[0]

                # Filter person detections with confidence > 0.7
                person_boxes = []
                for box, score, label in zip(predictions['boxes'], predictions['scores'], predictions['labels']):
                    if label == 1 and score > 0.7:  # 1 is the label for person in COCO dataset
                        person_boxes.append({
                            'box': box.tolist(),
                            'score': score.item()
                        })

                if person_boxes:
                    # Save frame with detections
                    frame_filename = f"{os.path.splitext(video_file.filename)[0]}_frame_{frame_idx}.jpg"
                    frame_path = os.path.join(Config.PROCESSED_FOLDER, frame_filename)
                    
                    # Draw boxes on frame
                    for detection in person_boxes:
                        box = detection['box']
                        cv2.rectangle(frame, 
                                    (int(box[0]), int(box[1])), 
                                    (int(box[2]), int(box[3])), 
                                    (0, 255, 0), 2)

                    cv2.imwrite(frame_path, frame)

                    frames_data.append({
                        'frame_idx': frame_idx,
                        'timestamp': frame_idx / fps,
                        'filename': frame_filename,
                        'detections': person_boxes
                    })

            frame_idx += 1

        cap.release()

        return {
            'video_id': os.path.splitext(video_file.filename)[0],
            'total_frames': frame_count,
            'fps': fps,
            'frames_with_detections': frames_data
        } 