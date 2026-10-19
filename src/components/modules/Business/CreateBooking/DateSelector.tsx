interface DateItem {
  fullISO: string;
  dayName: string;
  date: number;
  month: string;
}

interface DateSelectorProps {
  dates: DateItem[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const DateSelector = ({
  dates,
  selectedDate,
  setSelectedDate,
}: DateSelectorProps) => {
  const t = useTranslations("booking");
  return (
    <section>
      <h2 className="text-4xl font-black italic tracking-tighter mb-6 uppercase">
        {t("selectDate")}
      </h2>

      <div className="relative group">
        <div className="flex gap-3 overflow-x-auto pb-6 pt-2 px-2 no-scrollbar scroll-smooth whitespace-nowrap">
          {dates.map((d) => (
            <button
              key={d.fullISO}
              onClick={() => setSelectedDate(d.fullISO)}
              className={`shrink-0 w-24 h-32 rounded-[2.5rem] cursor-pointer flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                selectedDate === d.fullISO
                  ? "bg-slate-900 border-slate-900 text-white shadow-2xl -translate-y-1"
                  : "bg-white border-slate-100 text-slate-400 hover:border-green-400 hover:text-slate-600"
              }`}
            >
              <span className="text-[10px] font-bold uppercase mb-1 tracking-widest">
                {d.dayName}
              </span>

              <span className="text-3xl font-black tracking-tighter">
                {d.date}
              </span>

              <span className="text-[10px] font-bold uppercase opacity-60 mt-1">
                {d.month}
              </span>
            </button>
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-[#F8FAFC] to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default DateSelector;
import { useTranslations } from "next-intl";
