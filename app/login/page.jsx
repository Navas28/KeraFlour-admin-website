"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldUser, Mail, ChevronRight, Loader2 } from "lucide-react";
import PasswordInput from "../components/UI/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);

      if (data.user.role !== "admin") {
        localStorage.removeItem("token");
        toast.error("Access denied. Admin credentials required.");
        return;
      }

      toast.success(`Welcome back, ${data.user.name || "Admin"}!`);
      await fetchUser();
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-60" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-dark1 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-[-3deg]">
                <ShieldUser className="text-white" size={36} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Admin Panel
              </h2>
              <p className="text-gray-500 font-medium">
                Secure access to KeraFlour Management
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium"
                  />
                </div>

                <PasswordInput
                  placeholder="Access Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-dark1 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 hover:shadow-xl hover:shadow-emerald-900/10 active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-sm text-gray-500 font-medium">
                New administrator?{" "}
                <Link
                  href="/signup"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors ml-1"
                >
                  Create Master Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
