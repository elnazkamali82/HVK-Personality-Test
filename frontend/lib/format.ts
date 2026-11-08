const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function fa(value: number, digits = 0): string {
  return value
    .toFixed(digits)
    .replace(".", "٫")
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}
