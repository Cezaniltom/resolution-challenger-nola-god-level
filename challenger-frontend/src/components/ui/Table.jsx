// src/components/ui/Table.jsx
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function Table({
  headers,
  data,
  keys,
  formatters = {},
  onSort,
  sortConfig
}) {
  
  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      // Ícone sutil para mostrar que é clicável
      return <ArrowUp size={14} className="ml-1 text-gray-300" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp size={14} className="ml-1 text-blue-600" />; // Cor de destaque
    }
    return <ArrowDown size={14} className="ml-1 text-blue-600" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => {
              const key = keys[index]; 
              
              if (!onSort) {
                return (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {header}
                  </th>
                );
              }

              return (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <button
                    onClick={() => onSort(key)}
                    className="flex items-center gap-1 border-none bg-transparent p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                    {header}
                    {getSortIcon(key)}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {keys.map((key, colIndex) => {
                const cellValue = row[key];
                const formattedValue = formatters[key]
                  ? formatters[key](cellValue)
                  : cellValue;

                return (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                  >
                    {formattedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}