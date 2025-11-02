export function formatCurrencyBRL(value) {
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
}