const Sidebar = () => (
  <div className="w-60 bg-gray-900 text-gray-200 p-4 flex flex-col">
    <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
    <nav className="flex-1">
      <ul className="space-y-2">
        <li>
          <a href="/dashboard-panel" className="block p-2 rounded hover:bg-gray-700">
            Visão Geral
          </a>
        </li>
        <li>
          <a href="/dashboard-panel/products" className="block p-2 rounded hover:bg-gray-700">
            Produtos
          </a>
        </li>
        <li>
          <a href="/dashboard-panel/customers" className="block p-2 rounded hover:bg-gray-700">
            Clientes
          </a>
        </li>
        <li>
          <a href="/dashboard-panel/explorer" className="block p-2 rounded hover:bg-gray-700">
            Explorar
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

const Header = () => (
  <header className="bg-white shadow-sm border-b border-gray-200 p-4">
    <h1 className="text-xl font-semibold text-gray-800">Dashboard da Maria</h1>
  </header>
);


export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}