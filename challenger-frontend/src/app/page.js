import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona permanentemente o usuário da rota raiz "/"
  // para a página principal do dashboard.
  redirect('/dashboard-panel');
  
}