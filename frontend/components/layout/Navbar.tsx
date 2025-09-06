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
import { LogOut, User, BarChart3 } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 shrink-0"
            >
              <BarChart3 className="h-7 w-7 text-green-600" />
              <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                ESG Platform
              </span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/questionnaire"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50"
                >
                  Questionnaire
                </Link>
                <Link
                  href="/reports"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50"
                >
                  Reports
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 flex items-center justify-center"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-green-100 text-green-600 flex items-center justify-center text-lg font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2"
                  align="end"
                  sideOffset={8}
                >
                  <div className="flex items-center justify-start gap-3 p-2 border-b border-gray-100 mb-1">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild className="py-2">
                    <Link
                      href="/profile"
                      className="cursor-pointer text-gray-700 hover:text-gray-900 flex items-center"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-gray-700 hover:text-gray-900 py-2 flex items-center"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-green-600 hover:bg-green-50"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  asChild
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
