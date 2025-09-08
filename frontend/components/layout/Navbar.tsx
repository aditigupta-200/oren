"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center justify-between flex-1 md:justify-start">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ESG Platform
              </span>
            </Link>

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            )}

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center space-x-1 ml-8">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-4 py-2 rounded-md hover:bg-green-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/questionnaire"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-4 py-2 rounded-md hover:bg-green-50"
                >
                  Questionnaire
                </Link>
                <Link
                  href="/reports"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-4 py-2 rounded-md hover:bg-green-50"
                >
                  Reports
                </Link>
              </div>
            )}
          </div>

          {/* Right section - User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 rounded-full hover:bg-green-50"
                  >
                    <Avatar className="h-9 w-9 border-2 border-green-100">
                      <AvatarFallback className="bg-green-50 text-green-600 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-72 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
                  align="end"
                  alignOffset={-4}
                  sideOffset={8}
                >
                  <div className="flex items-start gap-3 p-4 bg-gray-50 border-b border-gray-200">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-green-600 text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-white">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium w-full"
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-medium w-full mt-1"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
                  asChild
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="block text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/questionnaire"
                className="block text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Questionnaire
              </Link>
              <Link
                href="/reports"
                className="block text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reports
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
