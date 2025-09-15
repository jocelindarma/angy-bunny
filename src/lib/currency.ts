export const toCurrency = (v: number | undefined | null) => {
  if (typeof v !== 'number' || isNaN(v)) {
    return 'Rp0';
  }
  const formatted = v
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Rp${formatted}`;
};