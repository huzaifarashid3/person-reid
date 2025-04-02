import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-12345'
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    PROCESSED_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'processed')
    TEMP_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'temp')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

    @classmethod
    def init_app(cls, app):
        # Create necessary directories if they don't exist
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(cls.PROCESSED_FOLDER, exist_ok=True)
        os.makedirs(cls.TEMP_FOLDER, exist_ok=True) 