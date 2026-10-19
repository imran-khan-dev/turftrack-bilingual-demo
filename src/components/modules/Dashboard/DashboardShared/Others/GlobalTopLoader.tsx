"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalTopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Trigger the top-center loader whenever the path or query filters change
  useEffect(() => {

    const frameId = requestAnimationFrame(() => setIsChangingPage(true));

    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 400);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return (
    <div className="pointer-events-none fixed top-4 left-0 right-0 z-[9999] flex justify-center transition-all duration-300">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-full shadow-md border border-slate-800 transition-all duration-300 ${
          isChangingPage
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95"
        }`}
      >
        <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        <span>Loading page records...</span>
      </div>
    </div>
  );
}
