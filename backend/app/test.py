import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import os
from transformers import CLIPProcessor, CLIPModel
import numpy as np

clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
image_model = clip_model.vision_model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
clip_model.to(device)
image_model.to(device)

inputs = clip_processor(text=["grey shirt"], return_tensors="pt", padding=True)
print("Text: ",inputs)
with torch.no_grad():
    text_embedding = clip_model.get_text_features(**inputs)
text_embedding = text_embedding.squeeze().tolist() 
text_embedding = torch.tensor([text_embedding])
print("Text Embedding: ",text_embedding,text_embedding.shape)

image = Image.open(r"backend\processed\WIN_20250410_18_29_18_Pro_frame_0.jpg")
inputs = clip_processor(images=image, return_tensors="pt")
print("Image: ",inputs)
with torch.no_grad():
    image_embeddings = clip_model.get_image_features(**inputs)

print("Image Embedding: ",image_embeddings,image_embeddings.shape)