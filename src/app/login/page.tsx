"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Enable button when fields are filled
  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  // Handle login
  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);

      // ✅ Save token to localStorage
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        router.push("/profile");
      } else {
        toast.error("Token missing in response");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">{loading ? "Logging in..." : "Login"}</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full max-w-sm p-2 mb-3 border rounded text-black"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full max-w-sm p-2 mb-3 border rounded text-black"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <button
        onClick={onLogin}
        disabled={buttonDisabled}
        className={`w-full max-w-sm p-2 rounded ${
          buttonDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } text-white transition`}
      >
        {loading ? "Please wait..." : "Login"}
      </button>

      <p className="mt-4">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
