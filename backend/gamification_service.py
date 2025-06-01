import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
import httpx
import uuid

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("gamification_service")

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

class GamificationService:
    """
    Service to handle gamification features:
    - Streaks for continuous logging
    - Achievement tracking for nutrition targets
    - Badge awards
    - Level and XP progression
    """
    
    def __init__(self):
        self.badge_definitions = {
            "first_meal": {
                "id": "first_meal",
                "name": "First Meal",
                "description": "Logged your first meal",
                "xp": 10
            },
            "streak_3": {
                "id": "streak_3",
                "name": "3-Day Streak",
                "description": "Logged meals for 3 consecutive days",
                "xp": 30
            },
            "streak_7": {
                "id": "streak_7",
                "name": "7-Day Streak",
                "description": "Logged meals for 7 consecutive days",
                "xp": 70
            },
            "streak_30": {
                "id": "streak_30",
                "name": "30-Day Streak",
                "description": "Logged meals for 30 consecutive days",
                "xp": 300
            },
            "protein_goal_5": {
                "id": "protein_goal_5",
                "name": "Protein Champion",
                "description": "Hit protein goals 5 days in a row",
                "xp": 50
            },
            "calorie_goal_5": {
                "id": "calorie_goal_5",
                "name": "Calorie Master",
                "description": "Stayed within calorie goals 5 days in a row",
                "xp": 50
            },
            "complete_day": {
                "id": "complete_day",
                "name": "Complete Day",
                "description": "Logged all meals in a day (breakfast, lunch, dinner)",
                "xp": 20
            },
            "nutritional_balance": {
                "id": "nutritional_balance",
                "name": "Nutritional Balance",
                "description": "Achieved balanced macros for 3 consecutive days",
                "xp": 40
            },
            "veggie_lover": {
                "id": "veggie_lover",
                "name": "Veggie Lover",
                "description": "Included vegetables in 10 meals",
                "xp": 35
            },
            "hydration_hero": {
                "id": "hydration_hero",
                "name": "Hydration Hero",
                "description": "Met water intake goal for 7 days",
                "xp": 45
            }
        }
        
        self.level_thresholds = [
            0,      # Level 1
            100,    # Level 2
            250,    # Level 3
            500,    # Level 4
            1000,   # Level 5
            1750,   # Level 6
            2750,   # Level 7
            4000,   # Level 8
            5500,   # Level 9
            7500    # Level 10
        ]
    
    async def process_meal_logged(self, user_id: str, meal_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a meal logged event and update gamification state
        """
        try:
            # 1. Get current gamification data for the user
            current_data = await self._get_gamification_data(user_id)
            
            # Initialize if it doesn't exist
            if not current_data:
                current_data = {
                    "user_id": user_id,
                    "badges": [],
                    "current_level": 1,
                    "xp": 0,
                    "streak_days": 0,
                    "last_meal_date": None,
                    "nutrition_goals_met": {},
                    "meal_counts": {},
                    "last_updated": datetime.now().isoformat()
                }
            
            # 2. Calculate updates based on the meal
            updates = await self._calculate_updates(user_id, current_data, meal_data)
            
            # 3. Apply the updates
            new_data = await self._apply_updates(current_data, updates)
            
            # 4. Save the updated gamification data
            await self._save_gamification_data(user_id, new_data)
            
            return updates
            
        except Exception as e:
            logger.error(f"Error processing meal logged event: {str(e)}")
            return {
                "error": str(e),
                "new_badges": [],
                "level_up": False,
                "xp_gained": 0,
                "current_level": current_data.get("current_level", 1) if current_data else 1,
                "current_xp": current_data.get("xp", 0) if current_data else 0
            }
    
    async def _get_gamification_data(self, user_id: str) -> Dict[str, Any]:
        """
        Get current gamification data for a user from the database
        """
        try:
            # In a production app, this would query Supabase
            # For now we'll return mock data
            
            # Mock response for a user with some existing data
            if user_id == "user-with-data":
                return {
                    "user_id": user_id,
                    "badges": [
                        {
                            "id": "first_meal",
                            "name": "First Meal",
                            "description": "Logged your first meal",
                            "earned_at": (datetime.now() - timedelta(days=5)).isoformat()
                        },
                        {
                            "id": "streak_3",
                            "name": "3-Day Streak",
                            "description": "Logged meals for 3 consecutive days",
                            "earned_at": (datetime.now() - timedelta(days=2)).isoformat()
                        }
                    ],
                    "current_level": 3,
                    "xp": 280,
                    "streak_days": 5,
                    "last_meal_date": (datetime.now() - timedelta(days=1)).date().isoformat(),
                    "nutrition_goals_met": {
                        "protein": 4,  # 4 days in a row
                        "calories": 3  # 3 days in a row
                    },
                    "meal_counts": {
                        "vegetables": 8  # 8 meals with vegetables
                    },
                    "last_updated": (datetime.now() - timedelta(days=1)).isoformat()
                }
            
            # For new users or simulating no data
            return None
            
        except Exception as e:
            logger.error(f"Error getting gamification data: {str(e)}")
            return None
    
    async def _calculate_updates(self, user_id: str, current_data: Dict[str, Any], 
                               meal_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate gamification updates based on the meal data and current state
        """
        updates = {
            "new_badges": [],
            "level_up": False,
            "xp_gained": 0
        }
        
        # Get current badges by ID for easy lookup
        current_badge_ids = [badge["id"] for badge in current_data.get("badges", [])]
        
        # 1. Base XP for logging a meal
        updates["xp_gained"] += 10
        
        # 2. Check for first meal badge
        if "first_meal" not in current_badge_ids:
            updates["new_badges"].append({
                **self.badge_definitions["first_meal"],
                "earned_at": datetime.now().isoformat()
            })
            updates["xp_gained"] += self.badge_definitions["first_meal"]["xp"]
        
        # 3. Check streak
        today = datetime.now().date()
        last_meal_date = current_data.get("last_meal_date")
        streak_days = current_data.get("streak_days", 0)
        
        # Convert string date to date object if needed
        if isinstance(last_meal_date, str):
            try:
                last_meal_date = datetime.strptime(last_meal_date, "%Y-%m-%d").date()
            except ValueError:
                last_meal_date = None
        
        # Update streak
        if last_meal_date:
            if last_meal_date == today - timedelta(days=1):
                # Continuing streak
                streak_days += 1
            elif last_meal_date < today - timedelta(days=1):
                # Streak broken
                streak_days = 1
            # If same day, no change to streak
        else:
            # First meal ever
            streak_days = 1
        
        updates["streak_days"] = streak_days
        
        # 4. Check for streak badges
        if streak_days >= 3 and "streak_3" not in current_badge_ids:
            updates["new_badges"].append({
                **self.badge_definitions["streak_3"],
                "earned_at": datetime.now().isoformat()
            })
            updates["xp_gained"] += self.badge_definitions["streak_3"]["xp"]
        
        if streak_days >= 7 and "streak_7" not in current_badge_ids:
            updates["new_badges"].append({
                **self.badge_definitions["streak_7"],
                "earned_at": datetime.now().isoformat()
            })
            updates["xp_gained"] += self.badge_definitions["streak_7"]["xp"]
        
        if streak_days >= 30 and "streak_30" not in current_badge_ids:
            updates["new_badges"].append({
                **self.badge_definitions["streak_30"],
                "earned_at": datetime.now().isoformat()
            })
            updates["xp_gained"] += self.badge_definitions["streak_30"]["xp"]
        
        # 5. Check nutrition goals (simplified for demo)
        nutrition_goals_met = current_data.get("nutrition_goals_met", {}).copy()
        nutrition = meal_data.get("nutrition", {})
        
        # Example: check protein goal
        protein_goal = 120  # Would come from user profile
        if nutrition.get("protein", 0) >= protein_goal:
            nutrition_goals_met["protein"] = nutrition_goals_met.get("protein", 0) + 1
            
            # Check for protein goal streak badge
            if nutrition_goals_met["protein"] >= 5 and "protein_goal_5" not in current_badge_ids:
                updates["new_badges"].append({
                    **self.badge_definitions["protein_goal_5"],
                    "earned_at": datetime.now().isoformat()
                })
                updates["xp_gained"] += self.badge_definitions["protein_goal_5"]["xp"]
        else:
            nutrition_goals_met["protein"] = 0  # Reset streak if goal not met
        
        updates["nutrition_goals_met"] = nutrition_goals_met
        
        # 6. Check for vegetable content (simplified)
        meal_counts = current_data.get("meal_counts", {}).copy()
        has_vegetables = any(food.get("name", "").lower() in ["vegetables", "greens", "broccoli", "spinach", "salad"] 
                            for food in meal_data.get("identified_foods", []))
        
        if has_vegetables:
            meal_counts["vegetables"] = meal_counts.get("vegetables", 0) + 1
            
            # Check for veggie lover badge
            if meal_counts["vegetables"] >= 10 and "veggie_lover" not in current_badge_ids:
                updates["new_badges"].append({
                    **self.badge_definitions["veggie_lover"],
                    "earned_at": datetime.now().isoformat()
                })
                updates["xp_gained"] += self.badge_definitions["veggie_lover"]["xp"]
        
        updates["meal_counts"] = meal_counts
        
        # 7. Check for level up
        new_xp = current_data.get("xp", 0) + updates["xp_gained"]
        current_level = current_data.get("current_level", 1)
        
        # Find the appropriate level for the new XP total
        new_level = current_level
        for level, threshold in enumerate(self.level_thresholds, start=1):
            if new_xp >= threshold:
                new_level = level
        
        if new_level > current_level:
            updates["level_up"] = True
            updates["new_level"] = new_level
        
        updates["current_level"] = new_level
        updates["current_xp"] = new_xp
        
        return updates
    
    async def _apply_updates(self, current_data: Dict[str, Any], 
                           updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Apply calculated updates to the current gamification data
        """
        new_data = current_data.copy()
        
        # Add new badges
        if "badges" not in new_data:
            new_data["badges"] = []
        
        new_data["badges"].extend(updates.get("new_badges", []))
        
        # Update XP and level
        new_data["xp"] = updates.get("current_xp", new_data.get("xp", 0))
        new_data["current_level"] = updates.get("current_level", new_data.get("current_level", 1))
        
        # Update streak
        new_data["streak_days"] = updates.get("streak_days", new_data.get("streak_days", 0))
        new_data["last_meal_date"] = datetime.now().date().isoformat()
        
        # Update nutrition goals
        new_data["nutrition_goals_met"] = updates.get("nutrition_goals_met", new_data.get("nutrition_goals_met", {}))
        
        # Update meal counts
        new_data["meal_counts"] = updates.get("meal_counts", new_data.get("meal_counts", {}))
        
        # Update timestamp
        new_data["last_updated"] = datetime.now().isoformat()
        
        return new_data
    
    async def _save_gamification_data(self, user_id: str, data: Dict[str, Any]) -> None:
        """
        Save gamification data to the database
        """
        try:
            # In a production app, this would update Supabase
            # For now we'll just log
            logger.info(f"Saving gamification data for user {user_id}: {json.dumps(data, default=str)}")
            
            # Example of how this would be done with Supabase
            # response = await httpx.post(
            #     f"{SUPABASE_URL}/rest/v1/gamification",
            #     headers={
            #         "apikey": SUPABASE_ANON_KEY,
            #         "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            #         "Content-Type": "application/json",
            #         "Prefer": "return=minimal"
            #     },
            #     json=data
            # )
            # response.raise_for_status()
            
        except Exception as e:
            logger.error(f"Error saving gamification data: {str(e)}")
            raise

# Create a singleton instance
gamification_service = GamificationService()
