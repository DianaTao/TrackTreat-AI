import os
import httpx
import base64
import json
from typing import Dict, List, Any, Optional
import logging
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
import numpy as np
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
import uuid
import time
import asyncio
from concurrent.futures import ThreadPoolExecutor
import functools

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ai_orchestrator")

# API keys and endpoints
USDA_API_KEY = os.getenv("USDA_API_KEY")
USDA_API_URL = os.getenv("USDA_API_URL", "https://api.nal.usda.gov/fdc/v1")

# Global variables for model and processor
image_processor = None
model = None
model_loaded = False
executor = ThreadPoolExecutor(max_workers=1)  # Single worker for model inference

def load_model():
    """Load the food classification model and image processor."""
    global image_processor, model, model_loaded
    try:
        logger.info("Loading food classification model and processor...")
        image_processor = AutoImageProcessor.from_pretrained("nateraw/food")
        model = AutoModelForImageClassification.from_pretrained("nateraw/food")
        model.eval()  # Set to evaluation mode
        model_loaded = True
        logger.info("Food classification model and processor loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

async def ensure_model_loaded():
    """Ensure the model is loaded before processing."""
    global model_loaded
    if not model_loaded:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, load_model)

def process_image_sync(image_data: bytes) -> List[Dict[str, Any]]:
    """Process image synchronously in thread pool"""
    try:
        # Convert bytes to PIL Image
        image = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image more aggressively for faster processing
        max_size = 224
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = tuple(int(dim * ratio) for dim in image.size)
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Prepare inputs
        inputs = image_processor(images=image, return_tensors="pt")
        
        # Get model predictions with no_grad for faster inference
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=-1)
            top_probs, top_indices = torch.topk(probs, k=3)
        
        # Process outputs
        food_items = []
        for prob, idx in zip(top_probs[0], top_indices[0]):
            confidence = prob.item()
            if confidence > 0.1:  # Only include items with confidence > 10%
                food_name = model.config.id2label[idx.item()]
                food_items.append({
                    "name": food_name,
                    "confidence": float(confidence),
                    "portion_size": "medium",
                    "weight_grams": 100
                })
        
        return food_items
        
    except Exception as e:
        logger.error(f"Error in process_image_sync: {str(e)}")
        return []

class AIOrchestrator:
    """
    Orchestrates the AI inference flow with timeout handling and optimization
    """
    
    def __init__(self):
        self.http_timeout = httpx.Timeout(10.0, connect=5.0)  # 10s total, 5s connect
        self.logger = logging.getLogger("ai_orchestrator")
        self.logger.info("AIOrchestrator initialized")
    
    async def process_meal(self, image_data: Optional[bytes], 
                          audio_data: Optional[bytes], 
                          manual_transcript: Optional[str],
                          user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for processing a meal with timeout handling
        """
        request_id = str(uuid.uuid4())[:8]
        self.logger.info(f"[{request_id}] === AI PROCESSING START ===")
        start_time = time.time()
        
        results = {
            "identified_foods": [],
            "transcript": None,
            "nutrition": {},
            "advice": None
        }
        
        try:
            # Set overall timeout for the entire process
            async with asyncio.timeout(60.0):  # 60 second total timeout
                
                # Step 1: Process image to identify foods (if provided)
                if image_data:
                    self.logger.info(f"[{request_id}] Starting food item identification")
                    
                    try:
                        # Timeout for food identification only
                        food_items = await asyncio.wait_for(
                            self.identify_food_items(image_data),
                            timeout=30.0  # 30 second timeout for food identification
                        )
                        results["identified_foods"] = food_items
                        self.logger.info(f"[{request_id}] Identified {len(food_items)} food items")
                        
                        # Get nutrition data with timeout
                        if food_items:
                            self.logger.info(f"[{request_id}] Starting nutrition data retrieval")
                            nutrition_data = await asyncio.wait_for(
                                self.get_nutrition_data_fast(food_items),
                                timeout=20.0  # 20 second timeout for nutrition data
                            )
                            results["nutrition"] = nutrition_data
                            
                    except asyncio.TimeoutError:
                        self.logger.warning(f"[{request_id}] Food identification timed out, using fallback")
                        results["identified_foods"] = self.get_fallback_foods()
                        results["nutrition"] = self.get_fallback_nutrition()
                
                # Step 2: Process audio for transcription (if provided)
                if audio_data:
                    self.logger.info(f"[{request_id}] Starting audio transcription")
                    transcript = await self.transcribe_audio(audio_data)
                    results["transcript"] = transcript
                elif manual_transcript:
                    results["transcript"] = manual_transcript
                
                # Step 3: Generate advice quickly
                if results["nutrition"]:
                    self.logger.info(f"[{request_id}] Starting advice generation")
                    advice = await self.generate_advice_fast(results["nutrition"], user_profile)
                    results["advice"] = advice
            
            total_time = time.time() - start_time
            self.logger.info(f"[{request_id}] Total processing time: {total_time:.2f} seconds")
            self.logger.info(f"[{request_id}] === AI PROCESSING END ===")
            
            return results
            
        except asyncio.TimeoutError:
            self.logger.error(f"[{request_id}] Overall processing timed out after 60 seconds")
            # Return fallback data
            return {
                "identified_foods": self.get_fallback_foods(),
                "transcript": manual_transcript,
                "nutrition": self.get_fallback_nutrition(),
                "advice": "Unable to analyze meal within time limit. Please try with a smaller image."
            }
        except Exception as e:
            self.logger.error(f"[{request_id}] Error in process_meal: {str(e)}", exc_info=True)
            raise
    
    async def identify_food_items(self, image_data: bytes) -> List[Dict[str, Any]]:
        """
        Use MobileNetV2 model to identify food items with timeout handling
        """
        request_id = str(uuid.uuid4())[:8]
        self.logger.info(f"[{request_id}] Starting food item identification")
        
        try:
            # Ensure model is loaded
            await ensure_model_loaded()
            
            # Process image in thread pool with timeout
            loop = asyncio.get_event_loop()
            food_items = await loop.run_in_executor(
                executor, 
                process_image_sync, 
                image_data
            )
            
            self.logger.info(f"[{request_id}] Identified {len(food_items)} food items")
            return food_items if food_items else self.get_fallback_foods()
            
        except Exception as e:
            self.logger.error(f"[{request_id}] Error identifying food items: {str(e)}")
            return self.get_fallback_foods()
    
    async def get_nutrition_data_fast(self, food_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Get nutrition data with optimized API calls and timeouts
        """
        try:
            self.logger.info(f"Getting nutrition data for {len(food_items)} food items")
            
            # Initialize aggregated nutrition data
            nutrition_data = {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "fiber": 0,
                "sugar": 0,
                "sodium": 0,
                "items": []
            }
            
            # Limit to first 3 items to reduce API calls
            limited_items = food_items[:3]
            
            # Use connection pooling and concurrent requests
            async with httpx.AsyncClient(timeout=self.http_timeout) as client:
                # Create tasks for concurrent API calls
                tasks = []
                for food in limited_items:
                    task = self.get_single_food_nutrition(client, food)
                    tasks.append(task)
                
                # Execute all tasks concurrently with timeout
                try:
                    results = await asyncio.wait_for(
                        asyncio.gather(*tasks, return_exceptions=True),
                        timeout=10.0  # 10 second timeout for all API calls
                    )
                    
                    # Process results
                    for result in results:
                        if isinstance(result, dict) and not isinstance(result, Exception):
                            nutrition_data["items"].append(result)
                            nutrition_data["calories"] += result.get("calories", 0)
                            nutrition_data["protein"] += result.get("protein", 0)
                            nutrition_data["carbs"] += result.get("carbs", 0)
                            nutrition_data["fat"] += result.get("fat", 0)
                            nutrition_data["fiber"] += result.get("fiber", 0)
                            nutrition_data["sugar"] += result.get("sugar", 0)
                            nutrition_data["sodium"] += result.get("sodium", 0)
                
                except asyncio.TimeoutError:
                    self.logger.warning("USDA API calls timed out, using estimated values")
                    return self.get_estimated_nutrition(food_items)
            
            return nutrition_data if nutrition_data["items"] else self.get_estimated_nutrition(food_items)
            
        except Exception as e:
            self.logger.error(f"Error getting nutrition data: {str(e)}")
            return self.get_estimated_nutrition(food_items)
    
    async def get_single_food_nutrition(self, client: httpx.AsyncClient, food: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get nutrition data for a single food item
        """
        try:
            # Search for the food item
            search_url = f"{USDA_API_URL}/foods/search"
            search_params = {
                "api_key": USDA_API_KEY,
                "query": food["name"],
                "pageSize": 1
            }
            
            search_response = await client.get(search_url, params=search_params)
            if search_response.status_code != 200:
                return self.get_estimated_single_nutrition(food)
            
            search_result = search_response.json()
            if not search_result.get("foods"):
                return self.get_estimated_single_nutrition(food)
            
            # Get detailed nutrition data
            food_id = search_result["foods"][0]["fdcId"]
            detail_url = f"{USDA_API_URL}/food/{food_id}"
            detail_params = {"api_key": USDA_API_KEY}
            
            detail_response = await client.get(detail_url, params=detail_params)
            if detail_response.status_code != 200:
                return self.get_estimated_single_nutrition(food)
            
            food_data = detail_response.json()
            
            # Extract nutrition values
            food_nutrition = {
                "name": food["name"],
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "fiber": 0,
                "sugar": 0,
                "sodium": 0
            }
            
            # Map USDA nutrients to our format
            nutrient_map = {
                "Energy": "calories",
                "Protein": "protein",
                "Carbohydrate, by difference": "carbs",
                "Total lipid (fat)": "fat",
                "Fiber, total dietary": "fiber",
                "Sugars, Total": "sugar",
                "Sodium, Na": "sodium"
            }
            
            for nutrient in food_data.get("foodNutrients", []):
                nutrient_name = nutrient.get("nutrient", {}).get("name")
                if nutrient_name in nutrient_map:
                    value = nutrient.get("amount", 0)
                    food_nutrition[nutrient_map[nutrient_name]] = value
            
            return food_nutrition
            
        except Exception as e:
            self.logger.error(f"Error getting nutrition for {food['name']}: {str(e)}")
            return self.get_estimated_single_nutrition(food)
    
    def get_fallback_foods(self) -> List[Dict[str, Any]]:
        """Return fallback food items when AI fails"""
        return [
            {
                "name": "mixed meal",
                "confidence": 0.5,
                "portion_size": "medium",
                "weight_grams": 200
            }
        ]
    
    def get_fallback_nutrition(self) -> Dict[str, Any]:
        """Return fallback nutrition data"""
        return {
            "calories": 400,
            "protein": 20,
            "carbs": 45,
            "fat": 15,
            "fiber": 5,
            "sugar": 8,
            "sodium": 600,
            "items": []
        }
    
    def get_estimated_nutrition(self, food_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get estimated nutrition when API fails"""
        # Simple estimation based on common foods
        total_calories = len(food_items) * 150  # 150 cal per item average
        
        return {
            "calories": total_calories,
            "protein": int(total_calories * 0.15 / 4),  # 15% protein
            "carbs": int(total_calories * 0.50 / 4),    # 50% carbs
            "fat": int(total_calories * 0.35 / 9),      # 35% fat
            "fiber": max(3, len(food_items) * 2),       # 2g fiber per item
            "sugar": int(total_calories * 0.10 / 4),    # 10% sugar
            "sodium": total_calories * 2,                # 2mg sodium per calorie
            "items": []
        }
    
    def get_estimated_single_nutrition(self, food: Dict[str, Any]) -> Dict[str, Any]:
        """Get estimated nutrition for a single food item"""
        return {
            "name": food["name"],
            "calories": 150,
            "protein": 6,
            "carbs": 19,
            "fat": 6,
            "fiber": 2,
            "sugar": 4,
            "sodium": 300
        }
    
    async def transcribe_audio(self, audio_data: bytes) -> str:
        """Transcribe audio with timeout"""
        try:
            # Mock implementation with timeout
            await asyncio.sleep(0.1)  # Simulate processing
            return "Audio transcription placeholder"
        except Exception as e:
            self.logger.error(f"Error transcribing audio: {str(e)}")
            return ""
    
    async def generate_advice_fast(self, nutrition_data: Dict[str, Any], 
                                  user_profile: Dict[str, Any]) -> str:
        """Generate advice quickly without external API calls"""
        try:
            calories = nutrition_data.get("calories", 0)
            protein = nutrition_data.get("protein", 0)
            
            advice_parts = []
            
            if calories > 0:
                if calories < 300:
                    advice_parts.append("This appears to be a light meal.")
                elif calories > 600:
                    advice_parts.append("This is a substantial meal.")
                else:
                    advice_parts.append("This looks like a well-portioned meal.")
            
            if protein > 20:
                advice_parts.append("Great protein content!")
            elif protein < 10:
                advice_parts.append("Consider adding more protein.")
            
            advice_parts.append("Keep up the good work with your nutrition tracking!")
            
            return " ".join(advice_parts)
            
        except Exception as e:
            self.logger.error(f"Error generating advice: {str(e)}")
            return "Keep tracking your meals for better health insights!"

# Create a singleton instance
ai_orchestrator = AIOrchestrator()