export const DOMAINS = [
  {
    id: "E",
    name: "برون‌گرایی",
    brief: "معاشرت، بیان نظر و انرژی در فعالیت",
  },
  {
    id: "A",
    name: "توافق‌پذیری",
    brief: "توجه به دیگران، احترام در گفت‌وگو و فرض حسن نیت",
  },
  {
    id: "C",
    name: "وظیفه‌شناسی",
    brief: "نظم، پیگیری کار و پذیرفتن مسئولیت",
  },
  {
    id: "N",
    name: "حساسیت هیجانی",
    brief: "نگرانی، دل‌گرفتگی و نوسان خلق",
  },
  {
    id: "O",
    name: "گشودگی به تجربه",
    brief: "کنجکاوی، درگیری با زیبایی و تصور راه‌های تازه",
  },
] as const;

export type DomainId = (typeof DOMAINS)[number]["id"];

export const FACETS = {
  sociability: { domain: "E", name: "اجتماعی بودن" },
  assertiveness: { domain: "E", name: "ابراز وجود" },
  energy: { domain: "E", name: "سطح انرژی" },
  compassion: { domain: "A", name: "توجه به دیگران" },
  respect: { domain: "A", name: "احترام در تعامل" },
  trust: { domain: "A", name: "اعتماد" },
  organization: { domain: "C", name: "نظم" },
  productiveness: { domain: "C", name: "پیگیری کار" },
  responsibility: { domain: "C", name: "مسئولیت‌پذیری" },
  anxiety: { domain: "N", name: "نگرانی" },
  lowMood: { domain: "N", name: "خلق پایین" },
  volatility: { domain: "N", name: "نوسان هیجانی" },
  curiosity: { domain: "O", name: "کنجکاوی فکری" },
  aesthetic: { domain: "O", name: "درگیری زیبایی‌شناختی" },
  imagination: { domain: "O", name: "تصور راه‌های تازه" },
} as const;

export type FacetId = keyof typeof FACETS;

export function domainById(id: DomainId) {
  const domain = DOMAINS.find((item) => item.id === id);
  if (!domain) {
    throw new Error(`Unknown domain: ${id}`);
  }
  return domain;
}
