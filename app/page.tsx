import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Dream Calendar
        </h1>
        <p className="text-2xl text-gray-700 mb-4">
          Turn Your Dreams Into Daily Action
        </p>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          AI-powered goal achievement platform that transforms long-term aspirations
          into actionable daily schedules. Let intelligent planning guide you from dreams to reality.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get Started with Google
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg border border-blue-600"
          >
            View Demo Dashboard
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">AI-Powered Planning</h3>
            <p className="text-gray-600">
              Let AI break down your ambitious goals into achievable daily tasks with smart scheduling.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Smart Calendar Integration</h3>
            <p className="text-gray-600">
              Automatically finds time in your Google Calendar and adapts to your schedule.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Adaptive Learning</h3>
            <p className="text-gray-600">
              System learns from your behavior and adjusts plans monthly to keep you on track.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
