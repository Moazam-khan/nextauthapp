// src/app/resetpassword/update/page.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import apiRoutes from "@/lib/api";
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token || !newPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(apiRoutes.resetPassword.update, {
        token,
        newPassword,
      });
      router.push("/login"); // Redirect to login page after successful reset
      
      toast.success("Password reset successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error resetting password:", error);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>

      <input
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md text-black"
        type="text"
        placeholder="Reset Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <input
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md text-black"
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={handleReset}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Updating..." : "Reset Password"}
      </button>
    </div>
  );
};

export default ResetPasswordPage;
