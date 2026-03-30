import React from "react";
import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-lg">
        <ClipLoader color="#1877f2" size={28} speedMultiplier={0.9} />
        <p className="text-[15px] font-medium text-slate-700">
          Refreshing your timeline...
        </p>
      </div>
    </div>
  );
}
