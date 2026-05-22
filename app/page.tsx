import { LoginForm } from "@/components/login/login-form";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(244,244,245,0.9)_45%,_rgba(228,228,231,0.85))] px-4 py-12 dark:bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.96),_rgba(9,9,11,0.96)_55%,_rgba(0,0,0,1))]">
      <LoginForm />
    </main>
  );
}
