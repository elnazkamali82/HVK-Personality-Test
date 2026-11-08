import { type DomainId, type FacetId } from "./domains";

export const INSTRUMENT_ID = "panjrakh-36";
export const INSTRUMENT_VERSION = "0.1.1";
export const AUDIENCE = "بزرگسالان ۱۸ سال به بالا";

export type ResponseFormat =
  | "agreement"
  | "frequency"
  | "situational"
  | "preference";

export interface ItemOption {
  value: number;
  label: string;
  tag?: string;
}

interface ScoredDraft {
  kind: "scored";
  format: "agreement" | "frequency";
  prompt: string;
  domain: DomainId;
  facet: FacetId;
  reverse: boolean;
}

interface OpenDraft {
  kind: "open";
  format: "situational" | "preference";
  prompt: string;
  options: { tag: string; label: string }[];
}

export interface Item {
  id: string;
  order: number;
  format: ResponseFormat;
  prompt: string;
  options: ItemOption[];
  scored: boolean;
  domain?: DomainId;
  facet?: FacetId;
  reverse?: boolean;
}

export const AGREEMENT_OPTIONS: ItemOption[] = [
  { value: 1, label: "کاملاً مخالفم" },
  { value: 2, label: "مخالفم" },
  { value: 3, label: "نه مخالف، نه موافق" },
  { value: 4, label: "موافقم" },
  { value: 5, label: "کاملاً موافقم" },
];

export const FREQUENCY_OPTIONS: ItemOption[] = [
  { value: 1, label: "تقریباً هرگز" },
  { value: 2, label: "به‌ندرت" },
  { value: 3, label: "گاهی" },
  { value: 4, label: "اغلب" },
  { value: 5, label: "تقریباً همیشه" },
];

const drafts: Array<ScoredDraft | OpenDraft> = [
  {
    kind: "scored",
    format: "agreement",
    domain: "E",
    facet: "sociability",
    reverse: false,
    prompt: "دورهمی خانوادگی یا جمع دوستانه معمولاً حالم را بهتر می‌کند.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "A",
    facet: "respect",
    reverse: false,
    prompt: "در بحث، اجازه می‌دهم طرف مقابل حرفش را تمام کند.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "organization",
    reverse: true,
    prompt: "وسایل دم‌دستم معمولاً شلوغ و بدون ترتیب‌اند.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "N",
    facet: "lowMood",
    reverse: false,
    prompt: "احساس دل‌گرفتگی یا بی‌حوصلگیِ ادامه‌دار به سراغم می‌آید.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "curiosity",
    reverse: false,
    prompt: "فهمیدن علت چیزها برایم جذاب است، حتی اگر کاربرد فوری نداشته باشد.",
  },
  {
    kind: "open",
    format: "situational",
    prompt:
      "در تیم کاری یا پروژه دانشگاهی، دو نفر سر نحوه انجام کار به هم گیر داده‌اند و فضا سنگین شده. احتمالاً چه می‌کنی؟",
    options: [
      { tag: "mediate", label: "سعی می‌کنم حرف هر دو را بشنوم و به یک جمع‌بندی برسم." },
      { tag: "direct", label: "اگر نظر روشنی داشته باشم، همان را صریح می‌گویم تا بحث طولانی نشود." },
      { tag: "distance", label: "تا وقتی از من نخواهند، وارد اختلافشان نمی‌شوم." },
      { tag: "soothe", label: "سعی می‌کنم فضا را کمی سبک کنم یا ادامه بحث را به بعد بگذارم." },
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "E",
    facet: "assertiveness",
    reverse: false,
    prompt: "در جمع، نظرم را روشن بیان می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "compassion",
    reverse: true,
    prompt: "درددل یا مشکل شخصی اطرافیان را معمولاً به خودم راه نمی‌دهم.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "C",
    facet: "productiveness",
    reverse: false,
    prompt: "وقتی کاری را شروع می‌کنم، حتی اگر سخت شود، برای تمام کردنش تلاش می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "anxiety",
    reverse: true,
    prompt: "در موقعیت‌های نامطمئن، معمولاً آرامشم را حفظ می‌کنم.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "O",
    facet: "aesthetic",
    reverse: false,
    prompt: "برای موسیقی، تصویر یا فضایی که زیبا می‌دانم وقت می‌گذارم.",
  },
  {
    kind: "open",
    format: "situational",
    prompt:
      "برای مهمانی، سفر یا قراری وقت گذاشته‌ای، اما ناگهان همه چیز عوض می‌شود و باید از نو بچینی. محتمل‌ترین واکنش اولیه‌ات چیست؟",
    options: [
      { tag: "stress", label: "اول ناراحت یا نگران می‌شوم و کمی طول می‌کشد تا به برنامه جدید فکر کنم." },
      { tag: "replan", label: "سریع سراغ فهرست کارهای جدید می‌روم تا دوباره رشته کار دستم باشد." },
      { tag: "reframe", label: "تغییر را یک امکان تازه می‌بینم و گزینه‌هایی را که قبلاً نبود امتحان می‌کنم." },
      { tag: "wait", label: "منتظر می‌مانم ببینم دیگران چه می‌کنند و بعد تصمیم می‌گیرم." },
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "E",
    facet: "energy",
    reverse: true,
    prompt: "در طول روز احساس کم‌انرژی بودن می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "trust",
    reverse: false,
    prompt: "تا وقتی خلافش را نبینم، برای همکار، همسایه یا غریبه‌ای که سر و کار دارم حسن نیت قائل می‌شوم.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "C",
    facet: "responsibility",
    reverse: true,
    prompt: "قول‌هایی که به دیگران می‌دهم، بی‌آنکه انجام شوند می‌مانند.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "volatility",
    reverse: false,
    prompt: "در یک روز، خلقم چند بار واضح تغییر می‌کند.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "O",
    facet: "imagination",
    reverse: true,
    prompt: "کارها را با روش آشنا و امتحان‌شده انجام می‌دهم.",
  },
  {
    kind: "open",
    format: "preference",
    prompt: "اگر مجبور باشی فقط یکی را انتخاب کنی، کدام را ترجیح می‌دهی؟",
    options: [
      { tag: "novel", label: "روی ایده‌ای کاملاً تازه کار کنم." },
      { tag: "refine", label: "یک روش آشنا را بهتر و دقیق‌تر اجرا کنم." },
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "E",
    facet: "sociability",
    reverse: true,
    prompt: "اگر بتوانم انتخاب کنم، کار اداری یا درسی‌ام را تنهایی جلو می‌برم، نه در جمع.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "compassion",
    reverse: false,
    prompt: "اگر کسی دوروبرم حال خوبی نداشته باشد، معمولاً به او توجه می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "productiveness",
    reverse: true,
    prompt: "در فشار کارهای روزمره، انجام کارها را به زمان دیگری موکول می‌کنم.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "N",
    facet: "volatility",
    reverse: true,
    prompt: "بعد از ناراحت شدن، به حال معمولم برمی‌گردم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "curiosity",
    reverse: true,
    prompt: "موضوع‌های نظری، اگر کاربرد مشخصی نداشته باشند، توجهم را کم نگه می‌دارند.",
  },
  {
    kind: "open",
    format: "situational",
    prompt:
      "چند کار ناتمام روی هم جمع شده و همان روز یکی از دوستانت برای کاری غیرضروری — مثل هماهنگی یا یک درخواست شخصی — از تو کمک می‌خواهد. چه می‌کنی؟",
    options: [
      { tag: "help", label: "کمک را می‌پذیرم، حتی اگر برنامه خودم فشرده‌تر شود." },
      { tag: "boundary", label: "رک می‌گویم امروز نمی‌رسم و زمان دیگری را پیشنهاد می‌کنم." },
      { tag: "slip", label: "کمک را قبول می‌کنم، ولی ممکن است دیرتر از چیزی که گفته‌ام انجامش دهم." },
      { tag: "sequence", label: "اول کارهای خودم را جلو می‌برم و اگر وقتی ماند کمک می‌کنم." },
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "E",
    facet: "assertiveness",
    reverse: true,
    prompt: "در کار گروهی، معمولاً منتظر می‌مانم دیگران مسیر کار را مشخص کنند.",
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "A",
    facet: "trust",
    reverse: true,
    prompt: "قبل از اعتماد کردن، به نشانه‌های سوءنیت توجه می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "organization",
    reverse: false,
    prompt: "وسایل و کارهایم معمولاً نظم مشخصی دارند.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "anxiety",
    reverse: false,
    prompt: "قبل از امتحان، مصاحبه یا سفر، احتمال پیشامدهای بد را زیاد در ذهنم مرور می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "aesthetic",
    reverse: true,
    prompt: "زیبایی موسیقی یا تصویر روی حال من اثر کمی دارد.",
  },
  {
    kind: "open",
    format: "preference",
    prompt:
      "یک کار مهم را هم می‌توانی عمدتاً تنهایی انجام بدهی و هم در تعامل مداوم با دیگران. کدام را انتخاب می‌کنی؟",
    options: [
      { tag: "solo", label: "عمدتاً تنهایی، با تعامل کم." },
      { tag: "interactive", label: "در تعامل مداوم با دیگران." },
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "E",
    facet: "energy",
    reverse: false,
    prompt: "بیشتر فعالیت‌های روزانه‌ام را با تحرک و انرژی شروع می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "respect",
    reverse: true,
    prompt: "اگر حوصله‌ام سر برود، حرف کسی را قطع می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "responsibility",
    reverse: false,
    prompt: "مسئولیتی را که پذیرفته‌ام، حتی بدون یادآوری دیگران انجام می‌دهم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "lowMood",
    reverse: true,
    prompt: "به‌طور کلی، حال درونی‌ام را خوب توصیف می‌کنم.",
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "imagination",
    reverse: false,
    prompt: "ایده‌ها یا راه‌های تازه، خودبه‌خود به ذهنم می‌رسند.",
  },
  {
    kind: "open",
    format: "situational",
    prompt:
      "در صف اداره یا کار اداری باید بین دو گزینه سریع تصمیم بگیری؛ اطلاعاتت کامل نیست و وقت هم محدود است. معمولاً چه می‌کنی؟",
    options: [
      { tag: "commit", label: "با همین اطلاعات یک گزینه را انتخاب می‌کنم تا کار معطل نماند." },
      { tag: "analyze", label: "ابهام‌ها را فهرست می‌کنم و تا جایی که وقت اجازه بدهد دنبال جوابشان می‌گردم." },
      { tag: "consult", label: "از کسی که تجربه بیشتری دارد نظر می‌گیرم و بعد تصمیم می‌گیرم." },
      { tag: "postpone", label: "تصمیم را عقب می‌اندازم تا تصویر روشن‌تری داشته باشم." },
    ],
  },
];

function scaleFor(format: "agreement" | "frequency"): ItemOption[] {
  return format === "agreement" ? AGREEMENT_OPTIONS : FREQUENCY_OPTIONS;
}

export const ITEMS: Item[] = drafts.map((draft, index) => {
  const order = index + 1;
  const id = `q${String(order).padStart(2, "0")}`;
  if (draft.kind === "scored") {
    return {
      id,
      order,
      format: draft.format,
      prompt: draft.prompt,
      options: scaleFor(draft.format),
      scored: true,
      domain: draft.domain,
      facet: draft.facet,
      reverse: draft.reverse,
    };
  }
  return {
    id,
    order,
    format: draft.format,
    prompt: draft.prompt,
    options: draft.options.map((option, optionIndex) => ({
      value: optionIndex + 1,
      label: option.label,
      tag: option.tag,
    })),
    scored: false,
  };
});

export function itemById(id: string): Item {
  const item = ITEMS.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown item: ${id}`);
  }
  return item;
}
