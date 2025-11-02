import Header from "@/components/layout/Header";
import Table from "@/components/ui/Table";
import { analyticsApi } from "@/lib/api";

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  } catch (error) {
    return dateString;
  }
}

export default async function CustomersPage() {
  
  const churnRiskCustomers = await analyticsApi.getCustomersChurnRisk();
  const headers = ["Cliente", "Frequência (Pedidos)", "Última Compra"];
  const keys = ["customer_name", "frequencia", "ultima_compra_data"]; 
  const formatters = {
    ultima_compra_data: (value) => formatDate(value)
  };

  return (
    <>
      <Header title="Clientes em Risco de Churn" />
      <div className="p-6">
        {churnRiskCustomers && churnRiskCustomers.length > 0 ? (
          <Table
            headers={headers}
            data={churnRiskCustomers}
            keys={keys}
            formatters={formatters}
          />
        ) : (
          <p className="text-center text-gray-500">
            Nenhum cliente em risco encontrado.
          </p>
        )}
      </div>
    </>
  );
}