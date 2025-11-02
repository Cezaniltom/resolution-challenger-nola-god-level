"use client";
import Link from "next/link";

export default function Sidebar() {
  const links = [
    { name: "Visão Geral", href: "/dashboard-panel" },
    { name: "Produtos", href: "/dashboard-panel/products" },
    { name: "Clientes", href: "/dashboard-panel/customers" },
    { name: "Explorar", href: "/dashboard-panel/explorer" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 p-6 text-white">
      <h2 className="mb-8 text-2xl font-semibold">Analytics</h2>
      <nav className="space-y-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="block rounded p-2 hover:bg-gray-700"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}