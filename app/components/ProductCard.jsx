import { Edit2, Trash2, Clock, IndianRupee } from "lucide-react";
import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-amber-100 flex flex-col">
      {/* Image */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden bg-amber-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-amber-300 italic text-sm">No image</div>
        )}
        <div className="absolute top-3 right-3 bg-white/95 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center border border-amber-100">
          <IndianRupee size={11} className="mr-0.5" />
          {product.pricePerKg}/kg
        </div>
        <div className="absolute top-3 left-3 bg-amber-700/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.machineType || "grain"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-base font-bold text-amber-900 leading-tight mb-1.5">
            {product.name}
          </h3>
          <div className="flex items-center text-amber-500 text-sm">
            <Clock size={13} className="mr-1.5 text-amber-400" />
            <span className="font-medium">
              {product.grindingTimePerKg || 10} mins / kg
            </span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-700 hover:text-white font-semibold text-sm transition-all duration-200 border border-amber-200 hover:border-amber-700"
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 border border-amber-200 hover:border-red-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
