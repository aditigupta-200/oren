import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex-1">
        <LoginForm />
      </div>
    </div>
  );
}
