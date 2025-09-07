export function calculatePercentageChange(oldValue: number | null, newValue: number | null): string | number {
  if (oldValue === null || newValue === null || !oldValue) return "N/A";
  return ((newValue - oldValue) / oldValue) * 100;
}

export function average(values: (number | null)[]): number | string {
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return "N/A";
  return validValues.reduce((a, b) => a + b, 0) / validValues.length;
}

export function max(values: (number | null)[]): number | string {
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return "N/A";
  return Math.max(...validValues);
}

export function sum(values: (number | null)[]): number | string {
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return "N/A";
  return validValues.reduce((a, b) => a + b, 0);
}

export function calculateTotalChange(startValue: number | null, endValue: number | null): string | number {
  if (startValue === null || endValue === null || !startValue) return "N/A";
  return ((endValue - startValue) / startValue) * 100;
}
