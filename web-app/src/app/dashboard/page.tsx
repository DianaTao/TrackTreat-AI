import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  // Mock data for the dashboard
  const mockData = {
    dailySummary: {
      calories: 1850,
      calorieGoal: 2200,
      protein: 85,
      proteinGoal: 120,
      carbs: 220,
      carbsGoal: 250,
      fat: 65,
      fatGoal: 70,
    },
    gamification: {
      level: 5,
      xp: 450,
      xpToNextLevel: 1000,
      streakDays: 7,
      badges: [
        { id: "1", name: "7-Day Streak", description: "Logged meals for 7 consecutive days" },
        { id: "2", name: "Protein Champion", description: "Hit protein goals 5 days in a row" },
        { id: "3", name: "Getting Started", description: "Created your account and logged your first meal" },
      ],
    },
    recentMeals: [
      { id: "1", name: "Breakfast", time: "8:30 AM", calories: 450 },
      { id: "2", name: "Lunch", time: "12:15 PM", calories: 680 },
      { id: "3", name: "Snack", time: "3:45 PM", calories: 220 },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-neutral-500">Your nutrition at a glance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Calories Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Daily Calories</CardTitle>
            <CardDescription>
              {mockData.dailySummary.calories} / {mockData.dailySummary.calorieGoal} kcal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={(mockData.dailySummary.calories / mockData.dailySummary.calorieGoal) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Macronutrients Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Macronutrients</CardTitle>
            <CardDescription>Daily progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Protein</span>
                <span>{mockData.dailySummary.protein}g / {mockData.dailySummary.proteinGoal}g</span>
              </div>
              <Progress 
                value={(mockData.dailySummary.protein / mockData.dailySummary.proteinGoal) * 100} 
                className="h-1.5" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carbs</span>
                <span>{mockData.dailySummary.carbs}g / {mockData.dailySummary.carbsGoal}g</span>
              </div>
              <Progress 
                value={(mockData.dailySummary.carbs / mockData.dailySummary.carbsGoal) * 100} 
                className="h-1.5" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fat</span>
                <span>{mockData.dailySummary.fat}g / {mockData.dailySummary.fatGoal}g</span>
              </div>
              <Progress 
                value={(mockData.dailySummary.fat / mockData.dailySummary.fatGoal) * 100} 
                className="h-1.5" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Level Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Level {mockData.gamification.level}</CardTitle>
            <CardDescription>
              {mockData.gamification.xp} / {mockData.gamification.xpToNextLevel} XP to next level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress 
              value={(mockData.gamification.xp / mockData.gamification.xpToNextLevel) * 100} 
              className="h-2"
            />
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-green-500 p-1.5 text-xs font-medium text-white">
                {mockData.gamification.streakDays}
              </div>
              <span className="text-sm text-neutral-600">Day streak</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Recent Badges</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {mockData.gamification.badges.map((badge) => (
            <Card key={badge.id}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9-6.2-3.2Z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">{badge.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{badge.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Meals Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Recent Meals</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockData.recentMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{meal.name}</div>
                    <div className="text-sm text-neutral-500">{meal.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{meal.calories} kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
