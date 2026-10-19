interface Field {
  id: string;
  name: string;
  description: string;
}

interface FieldSelectorProps {
  fields: Field[];
  selectedField: string;
  setSelectedField: (id: string) => void;
}

const FieldSelector = ({
  fields,
  selectedField,
  setSelectedField,
}: FieldSelectorProps) => {
  const t = useTranslations("booking");
  return (
    <section>
      <h2 className="text-3xl font-black italic tracking-tighter mb-6 uppercase">
        {t("chooseField")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map((field) => (
          <button
            key={field.id}
            onClick={() => setSelectedField(field.id)}
            className={`p-6 rounded-[2.5rem] cursor-pointer text-left transition-all border-2 ${
              selectedField === field.id
                ? "bg-white border-green-500 shadow-xl ring-2 ring-green-500/20"
                : "bg-white border-slate-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
            }`}
          >
            <h4 className="font-black italic text-slate-900 uppercase tracking-tighter">
              {field.name}
            </h4>

            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
              {field.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FieldSelector;
import { useTranslations } from "next-intl";
