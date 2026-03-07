"use client";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-mill-50/50 flex flex-col items-center justify-center p-6">
      {/* Spinner */}
      <div className="relative w-12 h-12 mb-6">
        {/* Static base ring */}
        <div className="absolute inset-0 border-4 border-mill-100 rounded-full"></div>
        {/* Animated top ring */}
        <div className="absolute inset-0 border-4 border-t-mill-600 rounded-full animate-spin"></div>
      </div>

      {/* Message */}
      <p className="text-mill-600 font-bold text-sm tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}
