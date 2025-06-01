from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from datetime import datetime
import json
import httpx
from dotenv import load_dotenv
import logging
import base64
from io import BytesIO
import uuid
import time
import asyncio
from contextlib import asynccontextmanager
# main.py
import asyncio
from ai_orchestrator import ai_orchestrator, load_model
from fastapi import FastAPI

app = FastAPI()

# Load environment variables
load_dotenv()

app = FastAPI(title="TrackTreat AI API", description="Backend API for TrackTreat AI application")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("main")

# Models
class Profile(BaseModel):
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None

class MealCreate(BaseModel):
    image_url: Optional[str] = None
    voice_url: Optional[str] = None
    manual_transcript: Optional[str] = None
    meal_name: Optional[str] = None
    meal_time: Optional[str] = None

class Meal(MealCreate):
    id: str
    user_id: str
    transcript: Optional[str] = None
    nutrition: Optional[Dict[str, Any]] = None
    advice: Optional[str] = None
    logged_at: str
    created_at: str

class MealUpdate(BaseModel):
    meal_name: Optional[str] = None
    manual_transcript: Optional[str] = None
    logged_at: Optional[str] = None

class Badge(BaseModel):
    id: str
    name: str
    description: str
    earned_at: str

class GamificationData(BaseModel):
    user_id: str
    badges: List[Badge]
    current_level: int
    xp: int
    last_updated: str

class EventCreate(BaseModel):
    user_id: str
    event_type: str
    metadata: Optional[Dict[str, Any]] = None

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to TrackTreat AI API"}

# Profile routes
@app.get("/profiles/{user_id}")
async def get_profile(user_id: str):
    # Placeholder for getting profile from Supabase
    # In a real implementation, this would query the Supabase database
    return {
        "id": "profile-123",
        "user_id": user_id,
        "weight_kg": 70,
        "height_cm": 175,
        "dob": "1990-01-01",
        "gender": "male",
        "activity_level": "moderate",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

@app.put("/profiles/{user_id}")
async def update_profile(user_id: str, profile: Profile):
    # Placeholder for updating profile in Supabase
    return {
        "id": "profile-123",
        "user_id": user_id,
        **profile.dict(),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

# Meal routes
@app.post("/meals/")
async def create_meal(meal: MealCreate, user_id: str = Form(...)):
    # This would:
    # 1. Process the uploaded image and voice recording
    # 2. Call the AI models for food recognition and speech transcription
    # 3. Get nutrition data from USDA API
    # 4. Generate personalized advice
    # 5. Save all data to Supabase
    # 6. Trigger gamification event

    # For now, we'll return a mock response
    meal_id = "meal-" + datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Mock AI processing results
    nutrition = {
        "calories": 650,
        "protein": 35,
        "carbs": 75,
        "fat": 22,
        "fiber": 8,
    }
    
    advice = "Great job including protein in your meal! Consider adding more vegetables for additional fiber."
    
    # Emit meal_logged event to Gamification Service
    event = EventCreate(
        user_id=user_id,
        event_type="meal_logged",
        metadata={"meal_id": meal_id, "nutrition": nutrition}
    )
    await create_event(event)
    
    return {
        "id": meal_id,
        "user_id": user_id,
        **meal.dict(),
        "transcript": "I had a chicken salad with quinoa and avocado for lunch.",
        "nutrition": nutrition,
        "advice": advice,
        "logged_at": datetime.now().isoformat(),
        "created_at": datetime.now().isoformat(),
    }

@app.get("/meals/")
async def get_meals(user_id: str, start_date: Optional[str] = None, end_date: Optional[str] = None):
    # Placeholder for querying meals from Supabase
    # This would filter by user_id and date range
    
    # Mock response with a list of meals
    return [
        {
            "id": "meal-20250527080000",
            "user_id": user_id,
            "image_url": "https://example.com/meals/breakfast.jpg",
            "meal_name": "Breakfast",
            "transcript": "Oatmeal with berries and Greek yogurt",
            "nutrition": {
                "calories": 450,
                "protein": 22,
                "carbs": 65,
                "fat": 12,
                "fiber": 8,
            },
            "advice": "Great breakfast choice! The oatmeal provides fiber and the Greek yogurt adds protein.",
            "logged_at": "2025-05-27T08:30:00Z",
            "created_at": "2025-05-27T08:30:00Z",
        }
    ]

@app.patch("/meals/{meal_id}")
async def update_meal(meal_id: str, meal: MealUpdate):
    # Placeholder for updating meal details in Supabase
    return {
        "id": meal_id,
        "user_id": "user-123",
        **meal.dict(exclude_unset=True),
        "updated_at": datetime.now().isoformat(),
    }

# Gamification routes
@app.get("/badges/{user_id}")
async def get_badges(user_id: str):
    # Placeholder for getting gamification data from Supabase
    return {
        "user_id": user_id,
        "badges": [
            {
                "id": "badge-1",
                "name": "7-Day Streak",
                "description": "Logged meals for 7 consecutive days",
                "earned_at": "2025-05-20T12:00:00Z",
            },
            {
                "id": "badge-2",
                "name": "Protein Champion",
                "description": "Hit protein goals 5 days in a row",
                "earned_at": "2025-05-25T12:00:00Z",
            },
        ],
        "current_level": 5,
        "xp": 450,
        "last_updated": datetime.now().isoformat(),
    }

@app.post("/events/")
async def create_event(event: EventCreate):
    # This would:
    # 1. Process the event in the Gamification Service
    # 2. Update streaks, badges, levels, and XP
    # 3. Save changes to Supabase
    
    # For now, just return a mock response
    return {
        "event_id": "event-" + datetime.now().strftime("%Y%m%d%H%M%S"),
        "processed": True,
        "new_badges": [],
        "level_up": False,
        "current_level": 5,
        "xp": 460,
    }

# Import AIOrchestrator at the top of the file
from ai_orchestrator import ai_orchestrator, load_model

@app.on_event("startup")
async def preload_food_model():
    """
    Load the food‐classification model exactly once, at startup.
    By running in a ThreadPoolExecutor, we avoid blocking the event loop.
    """
    loop = asyncio.get_event_loop()
    # run load_model() on a background thread to prevent blocking UVicorn's event loop
    await loop.run_in_executor(None, load_model)

# AI Meal Analysis Endpoint
@app.post("/analyze-meal")
async def analyze_meal(
    file: UploadFile = File(...),
    profile: str = Form(...)
):
    request_id = str(uuid.uuid4())[:8]
    logger.info(f"[{request_id}] === MEAL ANALYSIS REQUEST START ===")
    start_time = time.time()
    
    try:
        # Read image data with timeout
        try:
            image_data = await asyncio.wait_for(file.read(), timeout=30.0)
        except asyncio.TimeoutError:
            logger.error(f"[{request_id}] Timeout reading image data")
            raise HTTPException(status_code=408, detail="Timeout reading image data")
        
        # Validate image size
        if len(image_data) > 10 * 1024 * 1024:  # 10MB limit
            logger.error(f"[{request_id}] Image too large: {len(image_data)} bytes")
            raise HTTPException(status_code=413, detail="Image too large (max 10MB)")
        
        # Parse user profile
        try:
            user_profile = json.loads(profile)
        except json.JSONDecodeError:
            logger.error(f"[{request_id}] Invalid profile JSON")
            raise HTTPException(status_code=400, detail="Invalid profile JSON")
        
        # Process meal with timeout
        try:
            result = await asyncio.wait_for(
                ai_orchestrator.process_meal(
                    image_data=image_data,
                    audio_data=None,
                    manual_transcript=None,
                    user_profile=user_profile
                ),
                timeout=100.0  # 100 second timeout for entire processing
            )
        except asyncio.TimeoutError:
            logger.error(f"[{request_id}] Processing timeout")
            raise HTTPException(status_code=408, detail="Processing timeout")
        
        # Add processing time to result
        processing_time = time.time() - start_time
        result["processing_time"] = processing_time
        
        logger.info(f"[{request_id}] === MEAL ANALYSIS REQUEST END ===")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[{request_id}] Error processing meal: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}