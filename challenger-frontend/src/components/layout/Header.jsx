// components/layout/Header.jsx
export default function Header({ title }) {
  return (
    <header className="border-b border-gray-200 bg-white p-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    </header>
  );
}