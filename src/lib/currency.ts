export const toCurrency = (v: number) => {
  const formatted = v
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Rp${formatted}`;
};