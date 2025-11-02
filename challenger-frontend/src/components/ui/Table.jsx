/**
 * Componente de Tabela Reutilizável
 * @param {string[]} headers - Array de strings para os títulos das colunas.
 * @param {Array<Object>} data - Array de objetos onde cada objeto é uma linha.
 * @param {string[]} keys - Array de chaves do objeto para acessar os dados na ordem correta.
 * @param {Object} [formatters] - Objeto opcional com funções para formatar colunas específicas.
 */
export default function Table({
  headers,
  data,
  keys,
  formatters = {},
}) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {keys.map((key, colIndex) => {
                const cellValue = row[key];
                // Verifica se existe um formatador para esta chave
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