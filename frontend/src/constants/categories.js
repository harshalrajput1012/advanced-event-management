export const categories = [
  "MUSIC",
  "TECH",
  "SPORTS",
  "EDUCATION",
  "BUSINESS",
  "WORKSHOP",
  "FESTIVAL",
  "FOOD",
  "ART",
  "NETWORKING"
];

export function labelCategory(category) {
  return category
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
