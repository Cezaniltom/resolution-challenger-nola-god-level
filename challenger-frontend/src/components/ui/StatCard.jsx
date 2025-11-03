import { formatCurrencyBRL } from "@/lib/utils";

export default function StatCard({ title, value, format = "default" }) {
  let formattedValue;

  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    formattedValue = 'N/A';
  } else if (format === "currency") {
    formattedValue = formatCurrencyBRL(numericValue);
  } else {
    formattedValue = new Intl.NumberFormat("pt-BR").format(numericValue);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {formattedValue}
      </p>
    </div>
  );
}