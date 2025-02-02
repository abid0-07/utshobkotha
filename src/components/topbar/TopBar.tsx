"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/components/topbar/navLinks"; // Import the navLinks array

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold">Utsobkotha</h1>

      {/* Desktop Menu (Dynamically Rendered) */}
      <div className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-gray-300"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden block text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown (Dynamically Rendered) */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 flex flex-col items-center py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)} // Close menu when clicking a link
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
