"use client"
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
const Form = () => {
  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 max-w-sm rounded-lg shadow-lg">
        {/* Title */}
        <p className="text-xl font-semibold text-center text-gray-800 mb-6">
          Sign in to your account
        </p>

        {/* Email Input */}
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-5 bg-primary text-white font-medium text-sm uppercase rounded-lg hover:bg-indigo-700 transition"
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
