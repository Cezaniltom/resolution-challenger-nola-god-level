"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  ChevronLeft 
} from "lucide-react";

const links = [
  { name: "Visão Geral", href: "/dashboard-panel", icon: LayoutDashboard },
  { name: "Produtos", href: "/dashboard-panel/products", icon: ShoppingBag },
  { name: "Clientes", href: "/dashboard-panel/customers", icon: Users },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside 
      className={`flex h-screen flex-col bg-gray-900 p-4 text-gray-200 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-60'}`}
    >
      
      <div className={`mb-6 flex items-center pt-2 ${isCollapsed ? 'justify-center' : 'justify-center'}`}>
        <Image
          src="/logo.png" 
          alt="Analytics Logo"
          width={120} 
          height={40} 
          priority
          className={`overflow-hidden transition-all ${isCollapsed ? 'w-0' : 'w-32'}`}
        />
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon; 
            return (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={`flex items-center gap-3 rounded p-2 hover:bg-gray-700
                  ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon size={20} />
                  <span 
                    className={`overflow-hidden transition-all ${isCollapsed ? 'w-0' : 'w-full'}`}
                  >
                    {link.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-700 pt-4">
        <button 
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded p-2 hover:bg-gray-700"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}