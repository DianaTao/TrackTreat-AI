import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "TrackTreat AI - Your Nutrition Companion",
  description: "Track your meals and nutrition with AI-powered insights",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold">TrackTreat AI</span>
          </Link>
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/dashboard" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
              Dashboard
            </Link>
            <Link href="/log-meal" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
              Log Meal
            </Link>
            <Link href="/calendar" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
              Calendar
            </Link>
            <Link href="/profile" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
              Profile
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Avatar>
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} TrackTreat AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
