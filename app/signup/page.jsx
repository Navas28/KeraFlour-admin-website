"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  User,
  Mail,
  Key,
  ChevronRight,
  Loader2,
} from "lucide-react";
import PasswordInput from "../components/UI/PasswordInput";
import api from "@/lib/api";
import { toast } from "sonner";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name) return toast.error("Full Name is required");
    if (!formData.email) return toast.error("Email Address is required");
    if (!formData.password) return toast.error("Password is required");
    if (!formData.adminSecret)
      return toast.error("Admin Master Key is required");

    setLoading(true);

    try {
      await api.post("/auth/signup", formData);
      toast.success("Admin account created successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Signup failed. Please check the Master Key.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                <ShieldAlert className="text-white" size={36} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Admin Registry
              </h2>
              <p className="text-gray-500 font-medium">
                Create your secure administrator account
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium"
                  />
                </div>

                <PasswordInput
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <Key size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                      Admin Master Key
                    </span>
                  </div>
                  <PasswordInput
                    placeholder="Enter security secret"
                    value={formData.adminSecret}
                    onChange={(e) =>
                      setFormData({ ...formData, adminSecret: e.target.value })
                    }
                    icon={Key}
                  />
                </div>
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
                    <span>Initialize Admin Account</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Authorized user?{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors ml-1"
                >
                  Secure Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
