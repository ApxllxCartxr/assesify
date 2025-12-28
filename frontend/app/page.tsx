import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[url('/grid-pattern.svg')] bg-repeat">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold font-geist text-slate-800 dark:text-white leading-tight">
            The free, fun, and effective way to learn!
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Gamified quizzes, progress tracking, and detailed analytics for students and teachers.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full md:w-auto min-w-[200px]">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full md:w-auto min-w-[200px]">
              I already have an account
            </Button>
          </Link>
        </div>

        {/* Feature Cards (Skeletal) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <Card className="text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-brand-green/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🎮</span>
            </div>
            <h3 className="text-xl font-bold font-geist">Gamified Learning</h3>
            <p className="text-slate-500">Earn XP, keep streaks, and climb the leaderboard.</p>
          </Card>
          <Card className="text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-brand-blue/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold font-geist">Track Progress</h3>
            <p className="text-slate-500">Detailed analytics on your strengths and weaknesses.</p>
          </Card>
          <Card className="text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-brand-red/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">👩‍🏫</span>
            </div>
            <h3 className="text-xl font-bold font-geist">For Teachers</h3>
            <p className="text-slate-500">Upload materials and get insights into class performance.</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
