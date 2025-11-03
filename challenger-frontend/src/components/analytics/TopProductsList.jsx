import { formatCurrencyBRL } from "@/lib/utils";

function formatProductName(value) {
  if (typeof value === 'string' && value.includes(' #')) {
    return value.split(' #')[0];
  }
  return value;
}

export default function TopProductsList({ data }) {
  const hasRevenue = data.length > 0 && data[0].faturamento_total;

  return (
    <div className="flow-root">
      <ul role="list" className="divide-y divide-gray-200">
        {data.map((item) => (
          <li key={item.produto_nome} className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {formatProductName(item.produto_nome)}
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900">
                {hasRevenue 
                  ? formatCurrencyBRL(parseFloat(item.faturamento_total))
                  : `${item.total_vendido} vendidos`
                }
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}