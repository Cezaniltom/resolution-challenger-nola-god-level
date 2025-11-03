// src/app/page.js
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona permanentemente o usuário da rota raiz "/"
  // para a página principal do dashboard.
  redirect('/dashboard-panel');
  
  // Como o redirect() interrompe a renderização, 
  // não é necessário retornar nenhum JSX.
}