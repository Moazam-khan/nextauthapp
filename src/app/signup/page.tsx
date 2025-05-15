"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiRoutes from "@/lib/api"; // Import the API routes

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                // Signup API call
                const signupResponse = await axios.post(apiRoutes.signup, values);
                console.log("Signup success", signupResponse.data);

                // Show success alert
                alert("Signup successful! Please verify your email.");

                // Redirect to verify email page
                router.push(`/verifyemail?email=${encodeURIComponent(values.email)}`);
            } catch (error) {
             console.log(error);
            } finally {
                setLoading(false);
            }
        },
    });

   
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          {loading ? "Processing..." : "Create Account"}
        </h1>
        <hr className="mb-6 border-gray-300" />

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...formik.getFieldProps("username")}
              placeholder="Your username"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="you@example.com"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              placeholder="Create a strong password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        {/* Navigation Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
          Didnt verify email?
          <Link href="/verifyemail" className="text-green-600 hover:underline">
            Go to Email Verification
          </Link>
        </div>
      </div>
    </div>
  );
}