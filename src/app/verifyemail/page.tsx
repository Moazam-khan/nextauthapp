"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import apiRoutes from "@/lib/api"; // Import the API routes
import Link from "next/link";


export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const verifyUserEmail = async () => {
        try {
            // Call the verify email API using the imported route
            await axios.post(apiRoutes.verifyEmail, { token });
            setVerified(true);
            setError(false);

            // Redirect to login page after success
            setTimeout(() => {
                router.push("/profile");
            }, 2000); // Redirect after 2 seconds
        } catch (error: any) {
            setVerified(false);
            setError(true);
            console.error("Verification failed:", error.response?.data || error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify Email</h1>
            <p className="text-gray-700 mb-4">Please paste the token you received via email below:</p>

            <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your token"
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black w-80"
            />

            <button
                onClick={verifyUserEmail}
                className="p-2 bg-blue-500 text-white rounded-lg mb-4 focus:outline-none hover:bg-blue-600"
            >
                Verify
            </button>
             <p className="mt-4">
      {" "}
        <Link href="/login" className="text-blue-500 hover:underline">
         LOGIN
        </Link>
      </p>
            {verified && (
                <div>
                    <h2 className="text-2xl text-green-500">Email Verified Successfully!</h2>
                    <p className="text-gray-700">Redirecting to login page...</p>
                </div>
            )}

            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Verification Failed</h2>
                    <p className="text-gray-700">Invalid token. Please try again.</p>
                </div>
            )}
        </div>
    );
}