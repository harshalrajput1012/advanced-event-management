export function formatPrice(value, { showFree = true } = {}) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "Free";
  }

  if (showFree && amount === 0) {
    return "Free";
  }

  const fractionDigits = Number.isInteger(amount) ? 0 : 2;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(amount);
}
