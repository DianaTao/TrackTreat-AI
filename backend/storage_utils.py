import os
import logging
import uuid
from typing import Optional, Tuple
from datetime import datetime
import httpx
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("storage_utils")

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

class StorageManager:
    """
    Handles file storage operations with Supabase Storage
    """
    
    def __init__(self):
        self.use_mock = not all([SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY])
        if self.use_mock:
            logger.warning("Supabase credentials not found. Using mock storage.")
            
        # Create storage directory for local development
        os.makedirs('storage/meal-images', exist_ok=True)
        os.makedirs('storage/voice-notes', exist_ok=True)
    
    async def upload_image(self, user_id: str, image_data: bytes) -> Optional[str]:
        """
        Upload an image to storage and return the URL
        """
        try:
            # Generate a unique filename
            filename = f"{user_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.jpg"
            
            if self.use_mock:
                # Save to local storage for development
                filepath = f"storage/meal-images/{filename}"
                with open(filepath, "wb") as f:
                    f.write(image_data)
                logger.info(f"Saved image to local storage: {filepath}")
                return f"/storage/meal-images/{filename}"
            else:
                # Upload to Supabase storage
                path = f"meal-images/{filename}"
                headers = {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "image/jpeg",
                }
                
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"{SUPABASE_URL}/storage/v1/object/public/{path}",
                        headers=headers,
                        content=image_data
                    )
                    response.raise_for_status()
                    
                    # Get the public URL
                    data = response.json()
                    return f"{SUPABASE_URL}/storage/v1/object/public/{path}"
                
        except Exception as e:
            logger.error(f"Error uploading image: {str(e)}")
            return None
    
    async def upload_audio(self, user_id: str, audio_data: bytes) -> Optional[str]:
        """
        Upload an audio recording to storage and return the URL
        """
        try:
            # Generate a unique filename
            filename = f"{user_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.wav"
            
            if self.use_mock:
                # Save to local storage for development
                filepath = f"storage/voice-notes/{filename}"
                with open(filepath, "wb") as f:
                    f.write(audio_data)
                logger.info(f"Saved audio to local storage: {filepath}")
                return f"/storage/voice-notes/{filename}"
            else:
                # Upload to Supabase storage
                path = f"voice-notes/{filename}"
                headers = {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "audio/wav",
                }
                
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"{SUPABASE_URL}/storage/v1/object/public/{path}",
                        headers=headers,
                        content=audio_data
                    )
                    response.raise_for_status()
                    
                    # Get the public URL
                    return f"{SUPABASE_URL}/storage/v1/object/public/{path}"
                
        except Exception as e:
            logger.error(f"Error uploading audio: {str(e)}")
            return None
    
    def get_public_url(self, path: str) -> str:
        """
        Generate a public URL for a stored file
        """
        if self.use_mock:
            return path
        return f"{SUPABASE_URL}/storage/v1/object/public/{path}"
    
    async def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from storage
        """
        try:
            if self.use_mock:
                # Delete from local storage
                if os.path.exists(file_path.lstrip('/')):
                    os.remove(file_path.lstrip('/'))
                    logger.info(f"Deleted file from local storage: {file_path}")
                return True
            else:
                # Delete from Supabase storage
                headers = {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                }
                
                async with httpx.AsyncClient() as client:
                    response = await client.delete(
                        f"{SUPABASE_URL}/storage/v1/object/{file_path}",
                        headers=headers
                    )
                    response.raise_for_status()
                    return True
                
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return False

# Create a singleton instance
storage = StorageManager()
