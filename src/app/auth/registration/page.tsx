"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Registration() {
  // State to manage form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State to track errors for each field
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on typing
  };

  // Handle button click
  const handleClick = () => {
    let isValid = true;

    // Validate inputs
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      isValid = false;
    }

    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      isValid = false;
    }

    if (!formData.password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password is required",
      }));
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      isValid = false;
    }

    // If all validations pass, log the data
    if (isValid) {
      console.log("Form Submitted:", formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="gap-2 m-2 p-2 items-center justify-center">
        <form className="form-container bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="form-title text-2xl font-bold text-center text-gray-800 mb-6">
            Register
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Signup now and get full access to our app.
          </p>

          {/* Name Field */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder=" "
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => {
                if (!formData.name) {
                  setFormData((prev) => ({ ...prev, name: "" }));
                }
              }}
              className={`w-full px-4 py-3 pr-10 bg-white text-gray-600 border rounded-lg focus:outline-none ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary"
              }`}
            />
            <label
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
                formData.name ? "text-xs top-2" : ""
              } ${errors.name ? "text-red-500" : ""}`}
            >
              Name
            </label>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative mb-4">
            <input
              type="email"
              placeholder=" "
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => {
                if (!formData.email) {
                  setFormData((prev) => ({ ...prev, email: "" }));
                }
              }}
              className={`w-full px-4 py-3 pr-10 bg-white text-gray-600 border rounded-lg focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary"
              }`}
            />
            <label
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
                formData.email ? "text-xs top-2" : ""
              } ${errors.email ? "text-red-500" : ""}`}
            >
              Email
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" "
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => {
                if (!formData.password) {
                  setFormData((prev) => ({ ...prev, password: "" }));
                }
              }}
              className={`w-full px-4 py-3 pr-10 bg-white text-gray-600 border rounded-lg focus:outline-none ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary"
              }`}
            />
            <label
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
                formData.password ? "text-xs top-2" : ""
              } ${errors.password ? "text-red-500" : ""}`}
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder=" "
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => {
                if (!formData.confirmPassword) {
                  setFormData((prev) => ({ ...prev, confirmPassword: "" }));
                }
              }}
              className={`w-full px-4 py-3 pr-10 bg-white text-gray-600 border rounded-lg focus:outline-none ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary"
              }`}
            />
            <label
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
                formData.confirmPassword ? "text-xs top-2" : ""
              } ${errors.confirmPassword ? "text-red-500" : ""}`}
            >
              Confirm Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full py-3 px-5 bg-primary text-white font-medium text-sm uppercase rounded-lg hover:bg-indigo-700 transition"
            onClick={handleClick}
          >
            Submit
          </button>
        </form>

        <p className="signin-text text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-accent">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
