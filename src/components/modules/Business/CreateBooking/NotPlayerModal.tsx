import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface NotPlayerModalProps {
  show: boolean;
  onClose: () => void;
}

const NotPlayerModal = ({
  show,
  onClose,
}: NotPlayerModalProps) => {
  const t = useTranslations("booking");
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{
              scale: 0.92,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.92,
              opacity: 0,
              y: 20,
            }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            {/* glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

            {/* close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* icon */}
            <div className="h-20 w-20 rounded-4xl bg-yellow-100 flex items-center justify-center mb-6">
              <ShieldCheck
                size={36}
                className="text-yellow-500"
              />
            </div>

            {/* content */}
            <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900 mb-3">
              {t("playerAccessOnly")}
            </h2>

            <p className="text-slate-500 leading-7 text-sm mb-8">
              {t("playerAccessOnlyDescription")}
            </p>

            {/* button */}
            <button
              onClick={onClose}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase cursor-pointer"
            >
              {t("continueBrowsing")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotPlayerModal;
