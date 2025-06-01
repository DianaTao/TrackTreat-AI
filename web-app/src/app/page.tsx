import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page
  redirect('/login');
  
  // This is a fallback UI that will never be shown because of the redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to TrackTreat AI</h1>
        <p>Redirecting to login page...</p>
      </main>
    </div>
  );
}
