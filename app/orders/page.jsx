"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Loading from "../components/UI/Loading";
import ConfirmModal from "../components/UI/ConfirmModal";
import {
  ShoppingBag,
  Search,
  Package,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/api/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order set to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteSelected = async () => {
    try {
      await api.delete("/api/orders/bulk", {
        data: { orderIds: selectedOrders },
      });
      toast.success("Orders deleted successfully");
      setSelectedOrders([]);
      setShowDeleteModal(false);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to delete orders");
    }
  };

  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o._id));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (authLoading || loading) return <Loading message="Fetching orders..." />;

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Management
            </h1>
            <p className="text-gray-500">
              Track and manage all customer grain bookings.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {selectedOrders.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 transition-all hover:bg-red-700 active:scale-95"
              >
                Delete ({selectedOrders.length})
              </button>
            )}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none w-64 shadow-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {["all", "pending", "completed", "delivered", "cancelled"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold capitalize transition-all ${
                  filter === s
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-emerald-200"
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 w-10 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                      checked={
                        filteredOrders.length > 0 &&
                        selectedOrders.length === filteredOrders.length
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Order Details
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Quantity
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-8 py-20 text-center text-gray-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className={
                        selectedOrders.includes(order._id)
                          ? "bg-emerald-50/30"
                          : ""
                      }
                    >
                      <td className="px-8 py-6 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleSelect(order._id)}
                        />
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-50 rounded-2xl">
                            <Package size={20} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {order.product?.name || "Deleted Product"}
                            </p>
                            <p className="text-xs text-gray-400 font-medium font-mono">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="font-bold text-gray-900 text-sm">
                          {order.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {order.user?.email}
                        </p>
                      </td>
                      <td className="px-6 py-6 font-bold text-gray-900 text-sm">
                        {order.quantity} Kg
                      </td>
                      <td className="px-6 py-6 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <div className="flex items-center gap-3 justify-end">
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                updateStatus(order._id, "completed")
                              }
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                            >
                              Mark Completed
                            </button>
                          )}
                          {order.status === "completed" && (
                            <button
                              onClick={() =>
                                updateStatus(order._id, "delivered")
                              }
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              Deliver Order
                            </button>
                          )}

                          {order.status === "delivered" && (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                              <CheckCircle2 size={16} />
                              <span className="text-xs font-bold uppercase tracking-tight">
                                Success
                              </span>
                            </div>
                          )}

                          {order.status === "cancelled" && (
                            <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
                              <X size={16} />
                              <span className="text-xs font-bold uppercase tracking-tight">
                                Closed
                              </span>
                            </div>
                          )}

                          {order.status !== "delivered" &&
                            order.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  updateStatus(order._id, "cancelled")
                                }
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                              >
                                Cancel
                              </button>
                            )}

                          {(order.status === "delivered" ||
                            order.status === "cancelled") && (
                            <button
                              onClick={() => {
                                setSelectedOrders([order._id]);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Orders?"
        message={`Are you sure you want to delete ${selectedOrders.length} selected orders? This action cannot be undone.`}
        confirmText="Yes, Delete"
        onConfirm={deleteSelected}
        onCancel={() => setShowDeleteModal(false)}
      />
    </main>
  );
}

function StatusBadge({ status }) {
  const styles =
    {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      delivered: "bg-blue-50 text-blue-600 border-blue-100",
      cancelled: "bg-red-50 text-red-600 border-red-100",
    }[status] || "bg-gray-50 text-gray-500 border-gray-100";

  return (
    <span
      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border shadow-sm ${styles}`}
    >
      {status}
    </span>
  );
}
