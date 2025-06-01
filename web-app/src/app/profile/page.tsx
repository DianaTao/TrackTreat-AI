import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-neutral-500">Manage your personal information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details for more accurate nutrition recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" readOnly />
              <p className="text-xs text-neutral-500">
                Your email address cannot be changed
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Save Personal Information
            </Button>
          </CardFooter>
        </Card>

        {/* Body Measurements Card */}
        <Card>
          <CardHeader>
            <CardTitle>Body Measurements</CardTitle>
            <CardDescription>
              Update your measurements for personalized nutrition targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" min="0" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" min="0" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <select
                id="activityLevel"
                className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm"
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                <option value="active">Active (hard exercise 6-7 days/week)</option>
                <option value="very-active">Very active (very hard exercise & physical job)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <select
                id="goal"
                className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm"
              >
                <option value="">Select your goal</option>
                <option value="lose-weight">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain-weight">Gain Weight</option>
                <option value="build-muscle">Build Muscle</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Save Measurements
            </Button>
          </CardFooter>
        </Card>

        {/* Nutrition Targets Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Nutrition Targets</CardTitle>
            <CardDescription>
              Customize your daily nutrition targets or use automatically calculated values based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input id="calories" type="number" min="0" defaultValue="2200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input id="protein" type="number" min="0" defaultValue="120" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbohydrates (g)</Label>
                <Input id="carbs" type="number" min="0" defaultValue="250" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input id="fat" type="number" min="0" defaultValue="70" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input id="fiber" type="number" min="0" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input id="sugar" type="number" min="0" defaultValue="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sodium">Sodium (mg)</Label>
                <Input id="sodium" type="number" min="0" defaultValue="2300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water">Water (ml)</Label>
                <Input id="water" type="number" min="0" defaultValue="2500" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
            <Button variant="outline" type="button">
              Reset to Recommended
            </Button>
            <Button type="submit">
              Save Nutrition Targets
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
