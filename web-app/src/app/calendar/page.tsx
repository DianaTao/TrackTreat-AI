import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
  // Mock data for the calendar
  const today = new Date();
  const mockSelectedDay = today;
  
  // Mock meal data for the selected day
  const mockMeals = [
    {
      id: "1",
      name: "Breakfast",
      time: "8:30 AM",
      items: ["Oatmeal with berries", "Greek yogurt", "Coffee"],
      calories: 450,
      nutrition: { protein: 22, carbs: 65, fat: 12, fiber: 8 },
    },
    {
      id: "2",
      name: "Lunch",
      time: "12:15 PM",
      items: ["Grilled chicken salad", "Quinoa", "Avocado"],
      calories: 680,
      nutrition: { protein: 45, carbs: 55, fat: 25, fiber: 12 },
    },
    {
      id: "3",
      name: "Snack",
      time: "3:45 PM",
      items: ["Apple", "Almonds"],
      calories: 220,
      nutrition: { protein: 6, carbs: 25, fat: 12, fiber: 5 },
    },
    {
      id: "4",
      name: "Dinner",
      time: "7:00 PM",
      items: ["Salmon", "Roasted vegetables", "Brown rice"],
      calories: 750,
      nutrition: { protein: 40, carbs: 65, fat: 30, fiber: 10 },
    },
  ];

  // Calculate total nutrition for the day
  const totalNutrition = mockMeals.reduce(
    (acc, meal) => {
      return {
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fat: acc.fat + meal.nutrition.fat,
        fiber: acc.fiber + meal.nutrition.fiber,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-neutral-500">Track your meals and nutrition history</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Meal History</CardTitle>
            <CardDescription>
              View your logged meals by date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={mockSelectedDay}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {mockSelectedDay.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              Daily nutrition summary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-2 rounded-lg bg-neutral-50 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalNutrition.calories}</div>
                <div className="text-xs text-neutral-500">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalNutrition.protein}g</div>
                <div className="text-xs text-neutral-500">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalNutrition.carbs}g</div>
                <div className="text-xs text-neutral-500">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalNutrition.fat}g</div>
                <div className="text-xs text-neutral-500">Fat</div>
              </div>
            </div>

            {/* Meals List */}
            <div className="space-y-4">
              <h3 className="font-medium">Meals</h3>
              <div className="space-y-4">
                {mockMeals.map((meal) => (
                  <div key={meal.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex justify-between">
                      <div>
                        <h4 className="font-medium">{meal.name}</h4>
                        <div className="text-sm text-neutral-500">{meal.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{meal.calories} kcal</div>
                      </div>
                    </div>
                    <div className="mb-3 text-sm">
                      {meal.items.join(", ")}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="flex flex-col items-center rounded bg-neutral-100 px-2 py-1">
                        <span className="font-medium">{meal.nutrition.protein}g</span>
                        <span className="text-neutral-500">Protein</span>
                      </div>
                      <div className="flex flex-col items-center rounded bg-neutral-100 px-2 py-1">
                        <span className="font-medium">{meal.nutrition.carbs}g</span>
                        <span className="text-neutral-500">Carbs</span>
                      </div>
                      <div className="flex flex-col items-center rounded bg-neutral-100 px-2 py-1">
                        <span className="font-medium">{meal.nutrition.fat}g</span>
                        <span className="text-neutral-500">Fat</span>
                      </div>
                      <div className="flex flex-col items-center rounded bg-neutral-100 px-2 py-1">
                        <span className="font-medium">{meal.nutrition.fiber}g</span>
                        <span className="text-neutral-500">Fiber</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
