"use client";
import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  oldPassword: Yup.string()
    .required("Old password is required")
    .min(6, "Must be at least 6 characters"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Must be at least 6 characters"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const ChangePassword = () => {
  const handleSubmit = async (values: typeof initialValues, actions: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    try {
      const res = await axios.post(
        "/api/users/changepassword",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "Password changed successfully");
      actions.resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Change Password
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Old Password</label>
                <Field
                  type="password"
                  name="oldPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                  placeholder="Enter old password"
                />
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                  placeholder="Enter new password"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Confirm New Password</label>
                <Field
                  type="password"
                  name="confirmNewPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                  placeholder="Confirm new password"
                />
                <ErrorMessage
                  name="confirmNewPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
