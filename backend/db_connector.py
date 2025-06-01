import os
import json
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("db_connector")

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

class DatabaseConnector:
    """
    Handles connections and operations with the Supabase database
    """
    
    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
            logger.warning("Supabase credentials not found. Using mock data.")
            self.use_mock_data = True
        else:
            self.use_mock_data = False
            
        # HTTP client for API requests
        self.client = httpx.AsyncClient()
    
    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile data from the database
        """
        if self.use_mock_data:
            return self._get_mock_profile(user_id)
        
        try:
            response = await self.client.get(
                f"{SUPABASE_URL}/rest/v1/profiles",
                params={"user_id": f"eq.{user_id}"},
                headers=self._get_headers()
            )
            response.raise_for_status()
            
            profiles = response.json()
            return profiles[0] if profiles else None
            
        except Exception as e:
            logger.error(f"Error getting profile: {str(e)}")
            return None
    
    async def update_profile(self, user_id: str, data: Dict[str, Any]) -> bool:
        """
        Update user profile data in the database
        """
        if self.use_mock_data:
            logger.info(f"Mock: Updating profile for user {user_id}: {json.dumps(data)}")
            return True
        
        try:
            response = await self.client.patch(
                f"{SUPABASE_URL}/rest/v1/profiles",
                params={"user_id": f"eq.{user_id}"},
                headers=self._get_headers(),
                json=data
            )
            response.raise_for_status()
            return True
            
        except Exception as e:
            logger.error(f"Error updating profile: {str(e)}")
            return False
    
    async def create_meal(self, meal_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new meal record in the database
        """
        if self.use_mock_data:
            meal_id = f"meal-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            logger.info(f"Mock: Creating meal {meal_id}: {json.dumps(meal_data)}")
            return meal_id
        
        try:
            response = await self.client.post(
                f"{SUPABASE_URL}/rest/v1/meals",
                headers=self._get_headers(include_return=True),
                json=meal_data
            )
            response.raise_for_status()
            
            # Return the created meal ID
            created_meal = response.json()
            return created_meal.get("id")
            
        except Exception as e:
            logger.error(f"Error creating meal: {str(e)}")
            return None
    
    async def get_meals(self, user_id: str, start_date: Optional[str] = None, 
                       end_date: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get meals for a user within a date range
        """
        if self.use_mock_data:
            return self._get_mock_meals(user_id, start_date, end_date)
        
        try:
            params = {"user_id": f"eq.{user_id}"}
            
            # Add date range filters if provided
            if start_date:
                params["logged_at"] = f"gte.{start_date}"
            if end_date:
                # If both start and end dates are provided, update the condition
                if start_date:
                    params["logged_at"] = f"gte.{start_date},lte.{end_date}"
                else:
                    params["logged_at"] = f"lte.{end_date}"
            
            # Add ordering
            params["order"] = "logged_at.desc"
            
            response = await self.client.get(
                f"{SUPABASE_URL}/rest/v1/meals",
                params=params,
                headers=self._get_headers()
            )
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            logger.error(f"Error getting meals: {str(e)}")
            return []
    
    async def update_meal(self, meal_id: str, user_id: str, data: Dict[str, Any]) -> bool:
        """
        Update a meal record in the database
        """
        if self.use_mock_data:
            logger.info(f"Mock: Updating meal {meal_id} for user {user_id}: {json.dumps(data)}")
            return True
        
        try:
            response = await self.client.patch(
                f"{SUPABASE_URL}/rest/v1/meals",
                params={"id": f"eq.{meal_id}", "user_id": f"eq.{user_id}"},
                headers=self._get_headers(),
                json=data
            )
            response.raise_for_status()
            return True
            
        except Exception as e:
            logger.error(f"Error updating meal: {str(e)}")
            return False
    
    async def delete_meal(self, meal_id: str, user_id: str) -> bool:
        """
        Delete a meal record from the database
        """
        if self.use_mock_data:
            logger.info(f"Mock: Deleting meal {meal_id} for user {user_id}")
            return True
        
        try:
            response = await self.client.delete(
                f"{SUPABASE_URL}/rest/v1/meals",
                params={"id": f"eq.{meal_id}", "user_id": f"eq.{user_id}"},
                headers=self._get_headers()
            )
            response.raise_for_status()
            return True
            
        except Exception as e:
            logger.error(f"Error deleting meal: {str(e)}")
            return False
    
    async def get_gamification(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get gamification data for a user
        """
        if self.use_mock_data:
            return self._get_mock_gamification(user_id)
        
        try:
            response = await self.client.get(
                f"{SUPABASE_URL}/rest/v1/gamification",
                params={"user_id": f"eq.{user_id}"},
                headers=self._get_headers()
            )
            response.raise_for_status()
            
            gamification_data = response.json()
            return gamification_data[0] if gamification_data else None
            
        except Exception as e:
            logger.error(f"Error getting gamification data: {str(e)}")
            return None
    
    async def update_gamification(self, user_id: str, data: Dict[str, Any]) -> bool:
        """
        Update gamification data for a user
        """
        if self.use_mock_data:
            logger.info(f"Mock: Updating gamification for user {user_id}: {json.dumps(data)}")
            return True
        
        try:
            # Check if record exists
            response = await self.client.get(
                f"{SUPABASE_URL}/rest/v1/gamification",
                params={"user_id": f"eq.{user_id}"},
                headers=self._get_headers()
            )
            response.raise_for_status()
            
            exists = len(response.json()) > 0
            
            if exists:
                # Update existing record
                response = await self.client.patch(
                    f"{SUPABASE_URL}/rest/v1/gamification",
                    params={"user_id": f"eq.{user_id}"},
                    headers=self._get_headers(),
                    json=data
                )
            else:
                # Create new record
                response = await self.client.post(
                    f"{SUPABASE_URL}/rest/v1/gamification",
                    headers=self._get_headers(),
                    json={**data, "user_id": user_id}
                )
                
            response.raise_for_status()
            return True
            
        except Exception as e:
            logger.error(f"Error updating gamification data: {str(e)}")
            return False
    
    def _get_headers(self, include_return: bool = False) -> Dict[str, str]:
        """
        Get headers for Supabase API requests
        """
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json"
        }
        
        if include_return:
            headers["Prefer"] = "return=representation"
        
        return headers
    
    def _get_mock_profile(self, user_id: str) -> Dict[str, Any]:
        """
        Generate mock profile data for testing
        """
        return {
            "id": f"profile-{user_id}",
            "user_id": user_id,
            "weight_kg": 70,
            "height_cm": 175,
            "dob": "1990-01-01",
            "gender": "male",
            "activity_level": "moderate",
            "created_at": "2025-05-20T10:00:00Z",
            "updated_at": "2025-05-20T10:00:00Z"
        }
    
    def _get_mock_meals(self, user_id: str, start_date: Optional[str], 
                       end_date: Optional[str]) -> List[Dict[str, Any]]:
        """
        Generate mock meal data for testing
        """
        today = datetime.now().strftime('%Y-%m-%d')
        yesterday = (datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - 
                   datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        
        return [
            {
                "id": "meal-20250527083000",
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
                "logged_at": f"{today}T08:30:00Z",
                "created_at": f"{today}T08:30:00Z",
            },
            {
                "id": "meal-20250527121500",
                "user_id": user_id,
                "image_url": "https://example.com/meals/lunch.jpg",
                "meal_name": "Lunch",
                "transcript": "Grilled chicken salad with quinoa and avocado",
                "nutrition": {
                    "calories": 680,
                    "protein": 45,
                    "carbs": 55,
                    "fat": 25,
                    "fiber": 12,
                },
                "advice": "Excellent protein source with healthy fats from the avocado. A well-balanced lunch.",
                "logged_at": f"{today}T12:15:00Z",
                "created_at": f"{today}T12:15:00Z",
            },
            {
                "id": "meal-20250526190000",
                "user_id": user_id,
                "image_url": "https://example.com/meals/dinner_yesterday.jpg",
                "meal_name": "Dinner",
                "transcript": "Salmon with roasted vegetables and brown rice",
                "nutrition": {
                    "calories": 750,
                    "protein": 40,
                    "carbs": 65,
                    "fat": 30,
                    "fiber": 10,
                },
                "advice": "Omega-3 rich meal with good fiber content from the vegetables and brown rice.",
                "logged_at": f"{yesterday}T19:00:00Z",
                "created_at": f"{yesterday}T19:00:00Z",
            }
        ]
    
    def _get_mock_gamification(self, user_id: str) -> Dict[str, Any]:
        """
        Generate mock gamification data for testing
        """
        return {
            "user_id": user_id,
            "badges": [
                {
                    "id": "first_meal",
                    "name": "First Meal",
                    "description": "Logged your first meal",
                    "earned_at": "2025-05-20T10:15:00Z"
                },
                {
                    "id": "streak_3",
                    "name": "3-Day Streak",
                    "description": "Logged meals for 3 consecutive days",
                    "earned_at": "2025-05-23T09:30:00Z"
                }
            ],
            "current_level": 3,
            "xp": 280,
            "streak_days": 7,
            "last_updated": datetime.now().isoformat()
        }

# Create a singleton instance
db = DatabaseConnector()
