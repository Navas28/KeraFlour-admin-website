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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark1/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-6">
            <AlertTriangle className="text-red-500" size={28} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title || "Are you sure?"}
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            {message ||
              "This action cannot be undone. All data associated with this item will be permanently removed."}
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-[1.5] h-14 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete "
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
