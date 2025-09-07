"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ESGForm } from "@/components/questionnaire/ESGForm";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuestionnairePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card>
            <CardContent className="flex items-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="py-8 px-4">
        <ESGForm />
      </div>
    </div>
  );
}
