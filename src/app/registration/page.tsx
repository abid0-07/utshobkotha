"use client";

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="form-container">
        <h2 className="form-title">Register</h2>
        <p className="text-sm text-gray-400">
          Signup now and get full access to our app.
        </p>
        <label className="form-label">
          <input
            type="text"
            placeholder=" "
            required
            className="form-input peer"
          />
          <span>Name</span>
        </label>
        <label className="form-label">
          <input
            type="text"
            placeholder=" "
            required
            className="form-input peer"
          />
          <span>ID Number</span>
        </label>
        <label className="form-label">
          <input
            type="text"
            placeholder=" "
            required
            className="form-input peer"
          />
          <span>Department</span>
        </label>
        <label className="form-label">
          <input
            type="email"
            placeholder=" "
            required
            className="form-input peer"
          />
          <span>Email</span>
        </label>
        {/* Password Field */}
        <label className="form-label relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder=" "
            required
            className="form-input peer"
          />
          <span>Password</span>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </label>
        {/* Confirm Password Field */}
        <label className="form-label relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder=" "
            required
            className="form-input peer"
          />
          <span>Confirm Password</span>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </label>
        <button type="submit" className="submit-btn">
          Submit
        </button>
        <p className="signin-text">
          Already have an account?{' '}
          <a href="/login" className="signin-link">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
