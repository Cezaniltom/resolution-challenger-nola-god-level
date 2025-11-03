/**
 * @param {string} title - O título da página
 * @param {React.ReactNode} [actionComponent] - Um componente (ex: um botão) para ser exibido à direita
 */
export default function Header({ title, actionComponent }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white p-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      
      {actionComponent && (
        <div>
          {actionComponent}
        </div>
      )}
    </header>
  );
}