export default function CreateBookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
          {/* LEFT SIDE */}
          <div className="flex-1 space-y-12">
            {/* BUSINESS INFO */}
            <section className="mt-14">
              <div className="h-10 w-52 bg-slate-200 rounded-xl mb-6" />

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border-2 border-slate-100 rounded-4xl p-7"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-5 w-36 bg-slate-200 rounded-md mb-2" />
                        <div className="h-3 w-28 bg-slate-100 rounded-md" />
                      </div>

                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FIELD PICKER */}
            <section>
              <div className="h-10 w-44 bg-slate-200 rounded-xl mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-[2.5rem] bg-white border border-slate-200"
                  />
                ))}
              </div>
            </section>

            {/* DATE PICKER */}
            <section>
              <div className="h-10 w-44 bg-slate-200 rounded-xl mb-6" />

              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-24 h-32 rounded-[2.5rem] bg-white border border-slate-200 shrink-0"
                  />
                ))}
              </div>
            </section>

            {/* SLOT PICKER */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <div className="h-10 w-52 bg-slate-200 rounded-xl" />
                <div className="h-5 w-32 bg-slate-100 rounded-md" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-[2.2rem] bg-white border border-slate-200"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-[400px]">
            <aside className="sticky top-24">
              <div className="bg-slate-900 rounded-[3.5rem] p-8 shadow-2xl">
                {/* title */}
                <div className="h-6 w-40 bg-white/10 rounded-md mb-8" />

                {/* booking list */}
                <div className="space-y-3 mb-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-3xl bg-white/5" />
                  ))}
                </div>

                {/* total */}
                <div className="h-24 rounded-3xl bg-white/5 mb-6" />

                {/* checkboxes */}
                <div className="space-y-4 mb-8">
                  <div className="h-5 bg-white/5 rounded-md" />
                  <div className="h-5 bg-white/5 rounded-md" />
                </div>

                {/* button */}
                <div className="h-16 rounded-2xl bg-green-500/30" />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
