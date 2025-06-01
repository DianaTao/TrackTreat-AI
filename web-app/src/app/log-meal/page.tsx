import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LogMealPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log a Meal</h1>
        <p className="text-neutral-500">Capture your meal with photo and voice notes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Photo Capture Card */}
        <Card>
          <CardHeader>
            <CardTitle>Food Photo</CardTitle>
            <CardDescription>
              Take a photo of your meal for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-2 text-neutral-400"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <p className="text-sm text-neutral-500">
                  Click to take a photo or drag and drop
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="button" className="w-full md:w-auto">
                Take Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice Note Card */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Notes</CardTitle>
            <CardDescription>
              Record details about your meal with your voice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex aspect-video flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 text-neutral-400"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              <p className="text-center text-sm text-neutral-500">
                Press and hold to record voice notes about your meal
              </p>
              <div className="mt-4 w-full max-w-xs">
                <div className="h-8 rounded-full bg-neutral-100">
                  <div className="h-full w-0 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="button" className="w-full md:w-auto">
                Start Recording
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Manual Details</CardTitle>
            <CardDescription>
              Add additional information about your meal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mealName">Meal Name</Label>
              <Input id="mealName" placeholder="e.g., Breakfast, Lunch, Dinner, Snack" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mealTime">Time</Label>
              <Input id="mealTime" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mealNotes">Additional Notes</Label>
              <textarea
                id="mealNotes"
                rows={3}
                className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm"
                placeholder="Any additional details about your meal..."
              ></textarea>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Log Meal
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
