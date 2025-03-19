"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Form = () => {
  // State to manage form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State to track errors for each field
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const handleClick = (e: any) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: "", password: "" });

    // Validate inputs
    let isValid = true;

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      isValid = false;
    }

    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    }

    // If all validations pass, log the data
    if (isValid) {
      console.log("Form Submitted:", {
        email,
        password,
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 max-w-sm rounded-lg shadow-lg">
        {/* Title */}
        <p className="text-xl font-semibold text-center text-gray-800 mb-6">
          Sign in to your account
        </p>

        {/* Email Input */}
        <div className="relative mb-4">
          <label
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
              email ? "text-xs top-2" : ""
            } ${errors.email ? "text-red-500" : ""}`}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 pr-10 bg-white border rounded-lg focus:outline-none ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            onFocus={() => {
              if (!email) {
                setEmail(""); // Clear placeholder on focus
              }
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <label
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
              password ? "text-xs top-2" : ""
            } ${errors.password ? "text-red-500" : ""}`}
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 pr-10 bg-white border rounded-lg focus:outline-none ${
              errors.password
                ? "border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            onFocus={() => {
              if (!password) {
                setPassword(""); // Clear placeholder on focus
              }
            }}
          />
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-5 bg-primary text-white font-medium text-sm uppercase rounded-lg hover:bg-indigo-700 transition"
          onClick={handleClick}
        >
          Sign in
        </button>

        {/* Signup Link */}
        <p className="mt-4 text-sm text-center text-gray-500">
          No account?{" "}
          <a href="registration" className="text-accent">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Form;
