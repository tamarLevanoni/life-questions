const ONES   = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const TENS   = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
const HUNDREDS = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];

export function toHebrewNumeral(n: number): string {
  if (n <= 0 || n > 9999) return String(n);

  let result = '';
  let rem = n;

  const thousands = Math.floor(rem / 1000);
  if (thousands) { result += ONES[thousands] + "'"; rem -= thousands * 1000; }

  const hundreds = Math.floor(rem / 100);
  if (hundreds) { result += HUNDREDS[hundreds]; rem -= hundreds * 100; }

  // 15 → ט"ו, 16 → ט"ז (avoid divine names יה / יו)
  if (rem === 15) { result += 'טו'; rem = 0; }
  else if (rem === 16) { result += 'טז'; rem = 0; }

  const tens = Math.floor(rem / 10);
  if (tens) { result += TENS[tens]; rem -= tens * 10; }

  if (rem) result += ONES[rem];

  // add geresh: single letter → ׳, multiple → " before last
  if (result.length === 1) return result + '׳';
  return result.slice(0, -1) + '"' + result.slice(-1);
}
