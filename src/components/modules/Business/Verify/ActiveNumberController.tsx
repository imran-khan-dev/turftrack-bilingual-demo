"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";

interface ActiveNumberControllerProps {
  activeNumber: string;
  isOtpSent: boolean;
  isSendingOtp: boolean;
  isAllVerified: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onSendOtp: () => Promise<void>;
  onSaveChanges: (newNumber: string) => Promise<void>;
}

export default function ActiveNumberController({
  activeNumber,
  isOtpSent,
  isSendingOtp,
  isAllVerified,
  isEditing,
  setIsEditing,
  onSendOtp,
  onSaveChanges,
}: ActiveNumberControllerProps) {
  const [editedValue, setEditedValue] = useState(activeNumber);

  useEffect(() => {
    setEditedValue(activeNumber);
  }, [activeNumber]);

  if (isAllVerified) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-100 rounded-3xl gap-5 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-emerald-400 opacity-20"></span>
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-emerald-500/20 relative z-10">
            ✓
          </div>
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
            You are verified!
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Redirecting secure pipeline parameters to your control panel...
          </p>
        </div>
        <div className="flex items-center gap-1.5 justify-center pt-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="tel"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="w-full h-14 border border-green-500 rounded-2xl px-4 text-sm font-semibold outline-none bg-white text-slate-900"
        />
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditedValue(activeNumber);
            }}
            className="px-5 h-14 cursor-pointer text-xs font-black uppercase tracking-wide text-slate-500 bg-slate-100 rounded-2xl border border-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSaveChanges(editedValue)}
            className="px-5 h-14 cursor-pointer text-xs font-black uppercase tracking-wide text-slate-900 bg-green-500 rounded-2xl"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl gap-4">
      <div className="flex flex-col">
        <span className="text-lg font-black tracking-wide text-slate-900 leading-none">
          {activeNumber}
        </span>
        {!isOtpSent && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-green-600 transition-colors mt-1.5 text-left bg-transparent border-none p-0 outline-none cursor-pointer"
          >
            Change Number
          </button>
        )}
      </div>

      {!isOtpSent ? (
        <Button
          type="button"
          disabled={isSendingOtp}
          onClick={onSendOtp}
          className="h-10 px-4 bg-green-600 hover:bg-green-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md border-none cursor-pointer transition-all shrink-0"
        >
          {isSendingOtp ? "Sending..." : "Send OTP"}
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-[11px] font-black uppercase tracking-wider text-green-600 hover:text-green-500 cursor-pointer bg-transparent border-none p-0"
        >
          Change Number
        </button>
      )}
    </div>
  );
}
