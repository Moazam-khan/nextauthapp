"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

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
                const response = await axios.post("/api/users/signup", values);
                console.log("Signup success", response.data);
                router.push("/login");
            } catch (error: any) {
                console.log("Signup failed", error.message);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Signup"}</h1>
            <hr />
            <form onSubmit={formik.handleSubmit} className="flex flex-col items-center">
                <label htmlFor="username">Username</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="username"
                    type="text"
                    {...formik.getFieldProps("username")}
                    placeholder="Username"
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className="text-red-500">{formik.errors.username}</div>
                ) : null}

                <label htmlFor="email">Email</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="email"
                    type="email"
                    {...formik.getFieldProps("email")}
                    placeholder="Email"
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500">{formik.errors.email}</div>
                ) : null}

                <label htmlFor="password">Password</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="password"
                    type="password"
                    {...formik.getFieldProps("password")}
                    placeholder="Password"
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500">{formik.errors.password}</div>
                ) : null}

                <button
                    type="submit"
                    disabled={loading || !formik.isValid}
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                >
                    {loading ? "Processing..." : "Signup"}
                </button>
            </form>
            <Link href="/login">Visit login page</Link>
        </div>
    );
}