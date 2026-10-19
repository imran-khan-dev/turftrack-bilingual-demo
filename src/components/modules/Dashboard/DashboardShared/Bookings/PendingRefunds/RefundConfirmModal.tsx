/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, Loader2, Coins, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ModalProps {
  booking: any;
  processing: boolean;
  onClose: () => void;
  onConfirm: (booking: any) => Promise<void>;
  managerView?: boolean;
}

export default function RefundConfirmModal({ booking, processing, onClose, onConfirm, managerView = false }: ModalProps) {
  const t = useTranslations("manager.refunds");
  const isOverpaid = booking.isOverPaidRefunded === false && Number(booking.overPaidRefund || 0) > 0;
  const modalAmount = isOverpaid ? booking.overPaidRefund : booking.refundAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-100 w-full max-w-md rounded-2xl p-6 shadow-xl relative space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
          <X size={16} />
        </button>
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            {isOverpaid ? <Coins size={16} className="text-amber-600" /> : <Undo2 size={16} className="text-emerald-600" />}
            {managerView ? (isOverpaid ? t("confirmSettlement") : t("confirmRefund")) : (isOverpaid ? "Confirm Overpayment Settlement" : "Confirm Refund Issue")}
          </h4>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">{managerView ? t("reference") : "Reference Key:"}</span>
            <strong className="text-slate-700 font-bold">{booking.reference_id}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{managerView ? t("player") : "Client:"}</span>
            <span className="text-slate-700 font-medium">{booking.user?.fullName || "Guest Account"}</span>
          </div>
          <div className="border-t border-dashed border-slate-200 my-1 pt-1 flex justify-between items-center">
            <span className="text-slate-500 font-medium">{managerView ? t("returning") : "Overage Balance Returning:"}</span>
            <strong className={`${isOverpaid ? "text-amber-700" : "text-emerald-700"} text-sm font-extrabold`}>
              ৳{Number(modalAmount || 0).toLocaleString("en-BD")}
            </strong>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} disabled={processing} className="px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(booking)}
            disabled={processing}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm cursor-pointer ${isOverpaid ? "bg-black hover:bg-black/80" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            {processing ? <Loader2 size={13} className="animate-spin" /> : managerView ? (isOverpaid ? t("confirmAndSettle") : t("confirmAndDisburse")) : isOverpaid ? "Confirm & Settle" : "Confirm & Disburse"}
          </button>
        </div>
      </div>
    </div>
  );
}
