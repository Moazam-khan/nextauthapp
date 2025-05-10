"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use `null` to avoid immediate redirection

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false); // Mark as unauthenticated
    } else {
      setIsAuthenticated(true); // Mark as authenticated
    }
  }, []);

  const onChangePassword = async () => {
    try {
      setLoading(true);

      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must log in first!");
        router.push("/login");
        return;
      }

      // Make the API request to change the password
      const response = await axios.post(
        "/api/users/changepassword",
        passwords,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      console.log("Password change success:", response.data);

      // Show alert message
      alert("Password changed successfully!");

      // Show toast notification
      toast.success("Password changed successfully!");

      // Redirect to the profile page after success
      router.push("/profile");
    } catch (error: any) {
      console.error("Password change failed:", error.message);
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Handle unauthenticated state
  if (isAuthenticated === false) {
    router.push("/login"); // Redirect to login only if explicitly unauthenticated
    return null;
  }

  // Prevent rendering until authentication is verified
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Change Password"}</h1>
      <hr />

      <label htmlFor="oldPassword">Old Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="oldPassword"
        type="password"
        value={passwords.oldPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, oldPassword: e.target.value })
        }
        placeholder="Enter your old password"
      />

      <label htmlFor="newPassword">New Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="newPassword"
        type="password"
        value={passwords.newPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, newPassword: e.target.value })
        }
        placeholder="Enter your new password"
      />

      <label htmlFor="confirmNewPassword">Confirm New Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="confirmNewPassword"
        type="password"
        value={passwords.confirmNewPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, confirmNewPassword: e.target.value })
        }
        placeholder="Confirm your new password"
      />

      <button
        onClick={onChangePassword}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Change Password
      </button>
    </div>
  );
}