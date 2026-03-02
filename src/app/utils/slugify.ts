// src/app/utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // المسافات → -
    .replace(/[^\u0600-\u06FF\w\-]+/g, '') // السماح بالحروف العربية واللاتينية والأرقام
    .replace(/\-\-+/g, '-');     // دمج الـ --
}
