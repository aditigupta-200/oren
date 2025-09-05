import { RegisterForm } from "@/components/auth/RegisterForm";
import { Navbar } from "@/components/layout/Navbar";

export default function RegisterPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex-1 overflow-hidden ">
        <RegisterForm />
      </div>
    </div>
  );
}
