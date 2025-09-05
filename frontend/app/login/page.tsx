import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <LoginForm />
      </div>
    </div>
  );
}
