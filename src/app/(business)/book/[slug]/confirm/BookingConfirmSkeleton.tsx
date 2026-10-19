import { Skeleton } from "@/components/ui/skeleton";

export default function ConfirmBookingSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* MOBILE TOP TIMER */}
      <div className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <Skeleton className="h-10 w-24 rounded-2xl" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-40 lg:pb-12">
        <div className="mx-auto grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">
          {/* LEFT SECTION */}
          <div className="space-y-6 lg:space-y-8">
            {/* SELECTED SLOTS */}
            <section className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-100 shadow-sm">
              {/* heading */}
              <div className="flex items-center gap-3 mb-8">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-8 w-52 rounded-lg" />
              </div>

              {/* slot cards */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-[2rem] bg-slate-50/50 border border-slate-100 p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />

                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-3 w-24 rounded" />
                          <Skeleton className="h-5 w-44 rounded" />
                          <Skeleton className="h-4 w-32 rounded" />
                        </div>
                      </div>

                      <div className="space-y-2 sm:text-right">
                        <Skeleton className="h-3 w-10 ml-auto rounded" />
                        <Skeleton className="h-8 w-20 ml-auto rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROMO CODE */}
            <section className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-7 w-36 rounded" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-14 sm:h-12 flex-1 rounded-2xl" />
                <Skeleton className="h-12 w-full sm:w-32 rounded-2xl" />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 p-5">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-5 w-40 rounded" />
                    <Skeleton className="h-4 w-52 rounded" />
                  </div>
                </div>
              </div>
            </section>

            {/* PAYMENT OPTIONS */}
            <section className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-100 shadow-sm">
              <Skeleton className="h-8 w-40 rounded mb-8" />

              <div className="space-y-4">
                {/* full payment */}
                <div className="rounded-[2rem] border-2 border-slate-100 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Skeleton className="h-7 w-20 rounded" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* partial payment */}
                <div className="rounded-[2rem] border-2 border-slate-100 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-5">
                      <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-3 w-28 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-24 rounded-2xl" />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* DESKTOP RIGHT SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-10 bg-slate-900 rounded-[3rem] p-8 shadow-2xl">
              <Skeleton className="h-8 w-32 rounded mb-10 bg-slate-700" />

              {/* timer */}
              <Skeleton className="h-20 w-full rounded-3xl mb-8 bg-slate-800" />

              {/* rows */}
              <div className="space-y-6">
                <Skeleton className="h-5 w-full rounded bg-slate-800" />
                <Skeleton className="h-5 w-full rounded bg-slate-800" />

                <div className="h-px bg-slate-700" />

                <div className="rounded-[2rem] border border-slate-700 p-6">
                  <Skeleton className="h-3 w-28 mb-4 rounded bg-slate-700" />
                  <Skeleton className="h-14 w-40 rounded bg-slate-700" />
                </div>
              </div>

              {/* security text */}
              <div className="mt-10 flex gap-3">
                <Skeleton className="h-4 w-4 rounded bg-slate-700" />
                <Skeleton className="h-10 flex-1 rounded bg-slate-700" />
              </div>

              {/* buttons */}
              <div className="mt-8 space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl bg-slate-700" />
                <Skeleton className="h-12 w-full rounded-2xl bg-slate-700" />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE BOTTOM CHECKOUT DOCK */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 pt-4 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
          </div>

          <Skeleton className="h-10 w-20 rounded-2xl" />
        </div>

        <Skeleton className="h-16 w-full rounded-2xl mb-3" />
        <Skeleton className="h-11 w-full rounded-2xl" />
      </div>
    </div>
  );
}
