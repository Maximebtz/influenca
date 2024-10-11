import { redirect } from 'next/navigation';
 
export default function HomePage() {
  redirect('/home'); // Redirect to /home
 
  return null; // This won't render because of the redirect
}