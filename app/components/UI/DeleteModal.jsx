"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 border border-amber-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-amber-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all"
        >
          <X size={18} />
        </button>
        <div className="p-8">
          <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-5 border border-red-100">
            <AlertTriangle className="text-red-500" size={26} />
          </div>
          <h2 className="text-xl font-bold text-amber-900 mb-2">
            {title || "Are you sure?"}
          </h2>
          <p className="text-amber-500 leading-relaxed mb-7 text-sm font-medium">
            {message ||
              "This action cannot be undone. All data associated with this item will be permanently removed."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl font-bold text-amber-600 hover:bg-amber-50 border border-amber-200 transition-all disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-[1.5] h-12 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
