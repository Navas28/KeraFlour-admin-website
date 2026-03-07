"use client";

import { X, Trash2, LogOut, AlertCircle } from "lucide-react";

export default function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) {
  if (!show) return null;

  const isLogout = type === "logout";
  const isDanger = type === "danger";

  const iconBg = isLogout
    ? "bg-amber-50 border-amber-100"
    : isDanger
      ? "bg-red-50 border-red-100"
      : "bg-amber-50 border-amber-100";
  const Icon = isLogout ? LogOut : isDanger ? Trash2 : AlertCircle;
  const iconColor = isLogout
    ? "text-amber-600"
    : isDanger
      ? "text-red-500"
      : "text-amber-600";
  const btnClass = isLogout
    ? "bg-amber-600 hover:bg-amber-700"
    : isDanger
      ? "bg-red-500 hover:bg-red-600"
      : "bg-amber-600 hover:bg-amber-700";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-amber-100">
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-12 h-12 rounded-xl ${iconBg} border flex items-center justify-center`}
          >
            <Icon className={iconColor} size={22} />
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-amber-50 rounded-xl transition-colors text-amber-400"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="text-lg font-bold text-amber-900 mb-1.5">{title}</h3>
        <p className="text-amber-500 mb-7 leading-relaxed text-sm font-medium">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl font-bold transition-all hover:bg-amber-100 border border-amber-200 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-sm text-sm ${btnClass}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
