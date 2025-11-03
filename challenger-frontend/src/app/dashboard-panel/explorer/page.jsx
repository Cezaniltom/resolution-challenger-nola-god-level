// src/app/dashboard-panel/explorer/page.jsx
import { redirect } from 'next/navigation';

export default function ExplorerPage() {
  // Redireciona para a "Visão Geral", que agora contém tudo
  redirect('/dashboard-panel');
}