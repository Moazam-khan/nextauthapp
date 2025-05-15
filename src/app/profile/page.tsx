"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
        <p className="text-gray-500 mb-6">Welcome to your profile page.</p>

        <div className="mb-4">
          <h2 className="text-lg text-gray-700 font-semibold">User ID:</h2>
          <div className="mt-1 text-blue-600 font-mono break-all">
            {data === "nothing" ? (
              <span className="text-red-500">No data found</span>
            ) : (
              <Link href={`/profile/${data}`} className="underline hover:text-blue-800">
                {data}
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <button
            onClick={getUserDetails}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
          >
            Get User Details
          </button>

          <button
            onClick={() => router.push("/changepassword")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition"
          >
            Change Password
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
