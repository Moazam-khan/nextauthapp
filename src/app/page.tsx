import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Auth App</h1>
        <p className="text-gray-500 mb-8">Please choose an option to continue:</p>

        <div className="flex flex-col gap-4">
          <Link href="/login">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Login
            </button>
          </Link>

          <Link href="/signup">
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
