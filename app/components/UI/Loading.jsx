"use client";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}
