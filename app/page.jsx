"use client";

import { useAuth } from "@/context/AuthContext";
import { Clock, Users, TrendingUp, Package } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./components/UI/Loading";
import api from "@/lib/api";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/api/products"),
          api.get("/api/orders"),
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;

        const revenue = orders
          .filter((o) => o.status === "completed")
          .reduce((acc, curr) => acc + curr.totalPrice, 0);

        const pending = orders.filter((o) => o.status === "pending").length;

        setStats({
          totalProducts: products.length,
          pendingOrders: pending,
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (authLoading || loading) return <Loading />;

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "Admin"}
          </h1>
          <p className="text-gray-500">
            Here's what's happening at the mill today.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Grains"
            value={stats.totalProducts}
            icon={<Package className="text-emerald-600" />}
            trend="Active products"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<Clock className="text-amber-600" />}
            trend={`${stats.pendingOrders} to mill`}
          />
          <StatCard
            title="Active Customers"
            value="--"
            icon={<Users className="text-blue-600" />}
            trend="Coming soon"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue}`}
            icon={<TrendingUp className="text-purple-600" />}
            trend="Completed orders"
          />
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  );
}

function StatusItem({ label, status }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <span className="text-gray-600 font-medium">{label}</span>
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-sm font-bold text-gray-900">{status}</span>
      </div>
    </div>
  );
}
