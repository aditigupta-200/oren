"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Loader2, User, Mail, Lock, Leaf } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-100/20 to-teal-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8 px-4">
          <div className="inline-flex items-center gap-3 text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            ESG Platform
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Start Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ESG Journey
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Join organizations worldwide in building a more sustainable future
              through comprehensive ESG reporting.
            </p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Create Account
              </CardTitle>
              <CardDescription className="text-emerald-50">
                Join our ESG reporting platform
              </CardDescription>
            </div>

            <CardContent className="p-8 space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 text-red-700">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-300 focus:border-emerald-400 focus:ring-emerald-400 bg-white text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-emerald-600" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter valid email id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-300 focus:border-emerald-400 focus:ring-emerald-400 bg-white text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-emerald-600" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter valid password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-300 focus:border-emerald-400 focus:ring-emerald-400 bg-white text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-emerald-600" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-300 focus:border-emerald-400 focus:ring-emerald-400 bg-white text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl font-semibold transition-all duration-200 hover:text-emerald-600"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
