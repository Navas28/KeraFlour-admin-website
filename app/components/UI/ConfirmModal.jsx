"use client";

import { X, AlertCircle, Trash2, LogOut } from "lucide-react";

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

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <Trash2 className="text-red-600" size={24} />;
      case "logout":
        return <LogOut className="text-amber-600" size={24} />;
      default:
        return <AlertCircle className="text-emerald-600" size={24} />;
    }
  };

  const getLightBg = () => {
    switch (type) {
      case "danger":
        return "bg-red-50";
      case "logout":
        return "bg-amber-50";
      default:
        return "bg-emerald-50";
    }
  };

  const getConfirmBtn = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 shadow-red-100";
      case "logout":
        return "bg-amber-600 hover:bg-amber-700 shadow-amber-100";
      default:
        return "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-12 h-12 rounded-2xl ${getLightBg()} flex items-center justify-center`}
          >
            {getIcon()}
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold transition-all hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-6 py-4 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 ${getConfirmBtn()}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
