export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface FoodItem {
  name: string;
  nutrition?: NutritionInfo;
}

export interface AnalysisResult {
  foodItems: FoodItem[];
  hasAdvice: boolean;
  hasNutrition: boolean;
  processingTime: number;
  advice: string | null;
} 