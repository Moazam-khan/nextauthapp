"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import apiRoutes from "@/lib/api";
import Link from "next/link";

export default function GenerateResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestReset = async () => {
    try {
      setLoading(true);
      const response = await axios.post(apiRoutes.resetPassword.generate, { email });
      toast.success(response.data.message);

      // Redirect to the update password page
      router.push("/resetpassword/update");
    } catch (err) {
    console.log(err);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full max-w-sm mb-4 rounded text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleRequestReset}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        disabled={!email || loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      {/* Add a link to manually navigate to the update page */}
      <p className="mt-4">
        {" "}
        <Link
          href="/signup"
          className="text-blue-500 hover:underline"
        >
          Back to  Sign Up
        </Link>
      </p>
    </div>
  );
}