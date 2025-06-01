import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - TrackTreat AI",
  description: "Sign in or create an account for TrackTreat AI",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">TrackTreat AI</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your nutrition with AI-powered insights
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
