// src/app/dashboard-panel/products/page.jsx
import Header from "@/components/layout/Header";
import Table from "@/components/ui/Table";
import { formatCurrencyBRL } from "@/lib/utils";
import { analyticsApi } from "@/lib/api";

export default async function ProductsPage() {
  
  const topProducts = await analyticsApi.getTopProductsFiltrado();

  const headers = ["Produto", "Total Vendido (Qtd)"];
  const keys = ["produto_nome", "total_vendido"]; 
  const formatters = {
    produto_nome: (value) => {
      if (typeof value === 'string' && value.includes(' #')) {
        return value.split(' #')[0];
      }
      return value;
    }
  };

  return (
    <>
      <Header title="Produtos Mais Vendidos" />
      <div className="p-6">
        {topProducts && topProducts.length > 0 ? (
          <Table
            headers={headers}
            data={topProducts}
            keys={keys}
            formatters={formatters}
          />
        ) : (
          <p className="text-center text-gray-500">
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </>
  );
}