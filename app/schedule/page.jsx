"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Loading from "../components/UI/Loading";
import ConfirmModal from "../components/UI/ConfirmModal";
import {
  Calendar as CalendarIcon,
  Clock,
  Settings2,
  Plus,
  Trash2,
  AlertCircle,
  X,
  Coffee,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

export default function SchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [configs, setConfigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("holiday"); // holiday or schedule
  const [formData, setFormData] = useState({
    type: "holiday",
    date: "",
    dayOfWeek: 0,
    isClosed: true,
    openTime: "10:00",
    closeTime: "18:00",
    machineType: "both",
    reason: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configRes, orderRes] = await Promise.all([
        api.get("/api/admin/mill-config"),
        api.get("/api/orders"),
      ]);
      setConfigs(configRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      toast.error("Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/mill-config", formData);
      toast.success("Schedule updated successfully");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  const handleDeleteConfig = async (id) => {
    try {
      await api.delete(`/api/admin/mill-config/${id}`);
      toast.success("Configuration removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete configuration");
    }
  };

  // Logic to calculate capacity for selected date
  const selectedDateOrders = orders.filter(
    (o) => o.slotDate === selectedDate && o.status !== "cancelled",
  );

  const getCapacityByMachine = (machine) => {
    const machineOrders = selectedDateOrders.filter(
      (o) => o.machineType === machine,
    );
    const totalMinutes = machineOrders.reduce(
      (sum, o) => sum + (o.estimatedMinutes || 0),
      0,
    );
    return {
      minutes: totalMinutes,
      percent: Math.min(100, Math.round((totalMinutes / 480) * 100)), // 10:00 AM - 06:00 PM = 480 mins = 8 hours
      count: machineOrders.length,
    };
  };

  const grainCapacity = getCapacityByMachine("grain");
  const spiceCapacity = getCapacityByMachine("spice");

  if (authLoading || loading)
    return <Loading message="Loading mill schedule..." />;

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mill Management
            </h1>
            <p className="text-gray-500">
              Manage milling slots, machine capacity, and holidays.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setModalType("schedule");
                setFormData({ ...formData, type: "weekly_schedule" });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 text-gray-700 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all"
            >
              <Settings2 size={18} />
              Weekly Schedule
            </button>
            <button
              onClick={() => {
                setModalType("holiday");
                setFormData({
                  ...formData,
                  type: "holiday",
                  date: selectedDate,
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95"
            >
              <Plus size={18} />
              Add Holiday/Leave
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <CalendarIcon className="text-emerald-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Select Date</h2>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-700"
              />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Activity className="text-emerald-600" size={20} />
                Machine Usage
              </h2>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Grain Machine
                      </p>
                      <p className="text-xs text-gray-400">
                        {grainCapacity.count} orders today
                      </p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">
                      {grainCapacity.percent}% Full
                    </p>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${grainCapacity.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest text-right">
                    {grainCapacity.minutes} / 480 mins used
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Spice Machine
                      </p>
                      <p className="text-xs text-gray-400">
                        {spiceCapacity.count} orders today
                      </p>
                    </div>
                    <p className="text-sm font-bold text-amber-600">
                      {spiceCapacity.percent}% Full
                    </p>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${spiceCapacity.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest text-right">
                    {spiceCapacity.minutes} / 480 mins used
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Clock className="text-emerald-600" size={20} />
                  Daily Milling Queue
                </h2>
                <span className="px-4 py-1.5 bg-gray-50 rounded-full text-xs font-bold text-gray-500">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {selectedDateOrders.length === 0 ? (
                  <div className="p-20 text-center text-gray-400">
                    <Coffee className="mx-auto mb-4 opacity-20" size={48} />
                    <p>No slots booked for this date yet.</p>
                  </div>
                ) : (
                  selectedDateOrders
                    .sort((a, b) => a.slotTime?.localeCompare(b.slotTime))
                    .map((order) => (
                      <div
                        key={order._id}
                        className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          <div className="flex flex-col items-center justify-center w-24 px-3 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              Time Slot
                            </span>
                            <span className="text-xs font-bold text-gray-900 text-center">
                              {order.slotTime}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {order.product?.name}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                              Customer: {order.user?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-700">
                            {order.quantity} Kg
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            ~{order.estimatedMinutes} mins Grinding
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <AlertCircle className="text-amber-500" size={20} />
                Active Exceptions & Holidays
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {configs
                  .filter((c) => c.type === "holiday" || c.isClosed)
                  .map((config) => (
                    <div
                      key={config._id}
                      className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-start justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900 capitalize">
                          {config.type === "holiday"
                            ? config.date
                            : `Every ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][config.dayOfWeek]}`}
                        </p>
                        <p className="text-xs text-red-500 font-bold mt-1">
                          {config.isClosed
                            ? "Fully Closed"
                            : `Partial: ${config.openTime} - ${config.closeTime}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 italic">
                          "{config.reason || "No reason provided"}"
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteConfig(config._id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                {configs.length === 0 && (
                  <p className="text-sm text-gray-400 col-span-2 py-4">
                    No holidays or closures configured.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalType === "holiday"
                  ? "Record Holiday/Leave"
                  : "Weekly Schedule"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              {modalType === "holiday" ? (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Holiday Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Day
                  </label>
                  <select
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                    value={formData.dayOfWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dayOfWeek: parseInt(e.target.value),
                      })
                    }
                  >
                    {[
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day, i) => (
                      <option key={i} value={i}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <input
                  type="checkbox"
                  id="isClosed"
                  checked={formData.isClosed}
                  onChange={(e) =>
                    setFormData({ ...formData, isClosed: e.target.checked })
                  }
                  className="w-5 h-5 accent-emerald-600"
                />
                <label htmlFor="isClosed" className="font-bold text-gray-700">
                  Completely Closed
                </label>
              </div>

              {!formData.isClosed && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Open Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                      value={formData.openTime}
                      onChange={(e) =>
                        setFormData({ ...formData, openTime: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Close Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                      value={formData.closeTime}
                      onChange={(e) =>
                        setFormData({ ...formData, closeTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Machine Affected
                </label>
                <select
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                  value={formData.machineType}
                  onChange={(e) =>
                    setFormData({ ...formData, machineType: e.target.value })
                  }
                >
                  <option value="both">Both (Entire Mill)</option>
                  <option value="grain">Grain Machine Only</option>
                  <option value="spice">Spice Machine Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Machine maintenance, Public holiday"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
