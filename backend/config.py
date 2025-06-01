# config.py
"""
Configuration settings for TrackTreat AI API
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Timeout settings (in seconds)
    REQUEST_TIMEOUT = 100  # Total request timeout
    AI_PROCESSING_TIMEOUT = 90  # AI processing timeout
    MODEL_LOADING_TIMEOUT = 30  # Model loading timeout
    FOOD_IDENTIFICATION_TIMEOUT = 20  # Food identification timeout
    NUTRITION_API_TIMEOUT = 15  # USDA API calls timeout
    SINGLE_API_TIMEOUT = 10  # Single API call timeout
    HTTP_CONNECT_TIMEOUT = 5  # HTTP connection timeout
    
    # Image processing settings
    MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
    LARGE_IMAGE_WARNING = 1 * 1024 * 1024  # 1MB
    MAX_IMAGE_DIMENSION = 224  # Max dimension for model input
    
    # AI Model settings
    MODEL_NAME = "nateraw/food"
    CONFIDENCE_THRESHOLD = 0.1  # Minimum confidence for food items
    MAX_FOOD_ITEMS = 3  # Maximum food items to process for nutrition
    TOP_PREDICTIONS = 3  # Number of top predictions to return
    
    # USDA API settings
    USDA_API_KEY = os.getenv("USDA_API_KEY")
    USDA_API_URL = os.getenv("USDA_API_URL", "https://api.nal.usda.gov/fdc/v1")
    
    # Thread pool settings
    MAX_WORKERS = 2  # Number of worker threads
    
    # Fallback nutrition values (per 100g)
    FALLBACK_NUTRITION = {
        "calories_per_item": 150,
        "protein_ratio": 0.15,  # 15% of calories from protein
        "carbs_ratio": 0.50,    # 50% of calories from carbs
        "fat_ratio": 0.35,      # 35% of calories from fat
        "fiber_per_item": 2,    # 2g fiber per item
        "sugar_ratio": 0.10,    # 10% of calories from sugar
        "sodium_per_calorie": 2 # 2mg sodium per calorie
    }
    
    # Logging settings
    LOG_LEVEL = "INFO"
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'