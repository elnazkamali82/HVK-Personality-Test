import { type DomainId, type FacetId } from "./domains";

export const INSTRUMENT_ID = "panjrakh-36";
export const INSTRUMENT_VERSION = "0.1.2";
export const AUDIENCE = "بزرگسالان ۱۸ سال به بالا";
export const PROMPT_VARIANTS_KEY = "panjrakh-prompt-variants";

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
  /** Wording variants of the same construct; index 0 is canonical. */
  prompts: string[];
  domain: DomainId;
  facet: FacetId;
  reverse: boolean;
}

interface OpenDraft {
  kind: "open";
  format: "situational" | "preference";
  prompts: string[];
  options: { tag: string; label: string }[];
}

export interface Item {
  id: string;
  order: number;
  format: ResponseFormat;
  prompt: string;
  /** All wording variants for this item (same scoring keys). */
  promptVariants: string[];
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
    prompts: [
      "دورهمی خانوادگی یا جمع دوستانه معمولاً حالم را بهتر می‌کند.",
      "بودن کنار آدم‌هایی که می‌شناسم، انرژی‌ام را بالا می‌برد.",
      "جمع‌های خودمانی معمولاً بیشتر از تنهایی سرحالم می‌کند.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "A",
    facet: "respect",
    reverse: false,
    prompts: [
      "در بحث، اجازه می‌دهم طرف مقابل حرفش را تمام کند.",
      "وقتی کسی حرف می‌زند، تا آخر گوش می‌دهم و وسط حرفش نمی‌پرم.",
      "در گفت‌وگو صبر می‌کنم طرف مقابل جمله‌اش را کامل کند.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "organization",
    reverse: true,
    prompts: [
      "وسایل دم‌دستم معمولاً شلوغ و بدون ترتیب‌اند.",
      "روی میز یا کیفم غالباً چیزها بدون جای مشخص پخش‌اند.",
      "وسایل روزمره‌ام کمتر مرتب و دسته‌بندی‌شده‌اند.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "N",
    facet: "lowMood",
    reverse: false,
    prompts: [
      "احساس دل‌گرفتگی یا بی‌حوصلگیِ ادامه‌دار به سراغم می‌آید.",
      "حال سنگین یا بی‌انگیزگی برای مدتی همراهم می‌ماند.",
      "دوره‌هایی از بی‌حوصلگی طولانی را تجربه می‌کنم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "curiosity",
    reverse: false,
    prompts: [
      "فهمیدن علت چیزها برایم جذاب است، حتی اگر کاربرد فوری نداشته باشد.",
      "کنجکاویم برای دانستن «چرا» حتی بدون فایدهٔ فوری زنده است.",
      "دوست دارم سازوکار چیزها را بفهمم، ولو فعلاً به‌دردم نخورد.",
    ],
  },
  {
    kind: "open",
    format: "situational",
    prompts: [
      "در تیم کاری یا پروژه دانشگاهی، دو نفر سر نحوه انجام کار به هم گیر داده‌اند و فضا سنگین شده. احتمالاً چه می‌کنی؟",
      "در یک کار گروهی، اختلاف تندی بین دو نفر پیش آمده و جو جلسه خراب شده. واکنش محتمل‌ات چیست؟",
      "دو همکار/هم‌گروهی روی روش کار قفل کرده‌اند و بقیه هم ساکت مانده‌اند. تو معمولاً چه می‌کنی؟",
    ],
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
    prompts: [
      "در جمع، نظرم را روشن بیان می‌کنم.",
      "وسط جمع، حرفم را شفاف و مستقیم می‌گویم.",
      "وقتی گروهی هستیم، موضع خودم را واضح مطرح می‌کنم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "compassion",
    reverse: true,
    prompts: [
      "درددل یا مشکل شخصی اطرافیان را معمولاً به خودم راه نمی‌دهم.",
      "کمتر پیش می‌آید غصه یا نگرانی دیگران را عمیق بگیرم.",
      "معمولاً مسائل شخصی بقیه را از خودم دور نگه می‌دارم.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "C",
    facet: "productiveness",
    reverse: false,
    prompts: [
      "وقتی کاری را شروع می‌کنم، حتی اگر سخت شود، برای تمام کردنش تلاش می‌کنم.",
      "اگر کاری را دست بگیرم، وسط راه رهایش نمی‌کنم.",
      "تا کار شروع‌شده را به سرانجام نرسانم، راحت کنار نمی‌گذارمش.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "anxiety",
    reverse: true,
    prompts: [
      "در موقعیت‌های نامطمئن، معمولاً آرامشم را حفظ می‌کنم.",
      "وقتی آینده روشن نیست، کمتر از کوره درمی‌روم.",
      "در ابهام، معمولاً خونسردی‌ام را از دست نمی‌دهم.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "O",
    facet: "aesthetic",
    reverse: false,
    prompts: [
      "برای موسیقی، تصویر یا فضایی که زیبا می‌دانم وقت می‌گذارم.",
      "وقتی چیزی را زیبا می‌بینم یا می‌شنوم، برایش زمان می‌گذارم.",
      "با دیدن یا شنیدن چیزهای زیبا، حاضرم وقفه‌ای در کارم بیندازم.",
    ],
  },
  {
    kind: "open",
    format: "situational",
    prompts: [
      "برای مهمانی، سفر یا قراری وقت گذاشته‌ای، اما ناگهان همه چیز عوض می‌شود و باید از نو بچینی. محتمل‌ترین واکنش اولیه‌ات چیست؟",
      "برنامه‌ات به‌هم می‌ریزد و باید سریع جور دیگری بچینی. اول معمولاً چه حالی داری؟",
      "یک برنامهٔ جمعی ناگهان کنسل یا جابه‌جا می‌شود. واکنش اولیهٔ محتمل‌ات کدام است؟",
    ],
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
    prompts: [
      "در طول روز احساس کم‌انرژی بودن می‌کنم.",
      "وسط روز حس می‌کنم باتری‌ام زود خالی شده.",
      "اغلب روزها با کمبود انرژی جلو می‌روم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "trust",
    reverse: false,
    prompts: [
      "تا وقتی خلافش را نبینم، برای همکار، همسایه یا غریبه‌ای که سر و کار دارم حسن نیت قائل می‌شوم.",
      "در برخورد اول، معمولاً فرضم این است که طرف مقابل نیت بدی ندارد.",
      "تا دلیل روشنی نباشد، به آدم‌های تازه‌وارد سوءظن ندارم.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "C",
    facet: "responsibility",
    reverse: true,
    prompts: [
      "قول‌هایی که به دیگران می‌دهم، بی‌آنکه انجام شوند می‌مانند.",
      "بعضی تعهدهایی که می‌دهم بدون پیگیری می‌مانند.",
      "قول‌هایم گاهی روی هوا می‌مانند و تمام نمی‌شوند.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "volatility",
    reverse: false,
    prompts: [
      "در یک روز، خلقم چند بار واضح تغییر می‌کند.",
      "حالم در طول یک روز بالا و پایین می‌شود.",
      "در همان روز ممکن است چند بار حال و هوایم عوض شود.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "O",
    facet: "imagination",
    reverse: true,
    prompts: [
      "کارها را با روش آشنا و امتحان‌شده انجام می‌دهم.",
      "ترجیح می‌دهم کار را با همان راهی پیش ببرم که قبلاً جواب داده.",
      "برای انجام کارها سراغ روش‌های تکراری و مطمئن می‌روم.",
    ],
  },
  {
    kind: "open",
    format: "preference",
    prompts: [
      "اگر مجبور باشی فقط یکی را انتخاب کنی، کدام را ترجیح می‌دهی؟",
      "بین این دو، کدام برایت جذاب‌تر است؟",
      "اگر فقط یکی ممکن باشد، کدام را برمی‌گزینی؟",
    ],
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
    prompts: [
      "اگر بتوانم انتخاب کنم، کار اداری یا درسی‌ام را تنهایی جلو می‌برم، نه در جمع.",
      "برای پیشبرد کار، تنهایی را به کار در جمع ترجیح می‌دهم.",
      "اگر دست خودم باشد، کار جدی را دور از جمع انجام می‌دهم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "compassion",
    reverse: false,
    prompts: [
      "اگر کسی دوروبرم حال خوبی نداشته باشد، معمولاً به او توجه می‌کنم.",
      "وقتی اطرافیانم گرفته‌اند، حواسم به حالشان هست.",
      "ناراحتی آدم‌های نزدیکم را معمولاً بی‌پاسخ نمی‌گذارم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "productiveness",
    reverse: true,
    prompts: [
      "در فشار کارهای روزمره، انجام کارها را به زمان دیگری موکول می‌کنم.",
      "وقتی سرم شلوغ است، کارها را عقب می‌اندازم.",
      "زیر بار کار، انجام بعضی کارها را به بعد حواله می‌کنم.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "N",
    facet: "volatility",
    reverse: true,
    prompts: [
      "بعد از ناراحت شدن، به حال معمولم برمی‌گردم.",
      "پس از به‌هم‌ریختن حالم، دوباره سرجای خودم برمی‌گردم.",
      "ناراحتی‌ام طول نمی‌کشد و به حالت عادی می‌رسم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "curiosity",
    reverse: true,
    prompts: [
      "موضوع‌های نظری، اگر کاربرد مشخصی نداشته باشند، توجهم را کم نگه می‌دارند.",
      "اگر بحثی فایدهٔ عملی نداشته باشد، کمتر درگیرش می‌شوم.",
      "موضوع انتزاعی بدون کاربرد روشن، حوصله‌ام را زود سر می‌برد.",
    ],
  },
  {
    kind: "open",
    format: "situational",
    prompts: [
      "چند کار ناتمام روی هم جمع شده و همان روز یکی از دوستانت برای کاری غیرضروری — مثل هماهنگی یا یک درخواست شخصی — از تو کمک می‌خواهد. چه می‌کنی؟",
      "لیست کارهایت پر است و دوستی برای یک خواهش غیرضروری سراغت می‌آید. واکنش‌ات چیست؟",
      "روزت فشرده است؛ کسی برای کمک کوچک ولی غیرلازم به تو پیام می‌دهد. معمولاً چه می‌کنی؟",
    ],
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
    prompts: [
      "در کار گروهی، معمولاً منتظر می‌مانم دیگران مسیر کار را مشخص کنند.",
      "در تیم، بیشتر صبر می‌کنم بقیه جهت را روشن کنند.",
      "وقتی گروهی کار می‌کنیم، کمتر خودم مسیر را جلو می‌اندازم.",
    ],
  },
  {
    kind: "scored",
    format: "frequency",
    domain: "A",
    facet: "trust",
    reverse: true,
    prompts: [
      "قبل از اعتماد کردن، به نشانه‌های سوءنیت توجه می‌کنم.",
      "تا مطمئن نشوم، حواسم به احتمال نیت بد طرف مقابل هست.",
      "قبل از باز کردن درِ اعتماد، دنبال نشانه‌های احتیاط می‌گردم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "organization",
    reverse: false,
    prompts: [
      "وسایل و کارهایم معمولاً نظم مشخصی دارند.",
      "جای چیزها و ترتیب کارها برایم روشن است.",
      "معمولاً برای وسایل و کارها نظم قابل‌اتکایی دارم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "anxiety",
    reverse: false,
    prompts: [
      "قبل از امتحان، مصاحبه یا سفر، احتمال پیشامدهای بد را زیاد در ذهنم مرور می‌کنم.",
      "پیش از موقعیت‌های مهم، سناریوهای منفی را در سرم تکرار می‌کنم.",
      "قبل از رویدادهای پراسترس، مدام به چیزهایی که ممکن است خراب شود فکر می‌کنم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "aesthetic",
    reverse: true,
    prompts: [
      "زیبایی موسیقی یا تصویر روی حال من اثر کمی دارد.",
      "موسیقی یا تصویر زیبا کمتر حالم را جابه‌جا می‌کند.",
      "زیبایی دیداری یا شنیداری کمتر روی حال روزمره‌ام اثر می‌گذارد.",
    ],
  },
  {
    kind: "open",
    format: "preference",
    prompts: [
      "یک کار مهم را هم می‌توانی عمدتاً تنهایی انجام بدهی و هم در تعامل مداوم با دیگران. کدام را انتخاب می‌کنی؟",
      "برای یک کار جدی، تنهاییِ نسبی بهتر است یا تعامل پیوسته؟",
      "اگر کار مهمی داشته باشی، کدام فضا را برمی‌گزینی؟",
    ],
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
    prompts: [
      "بیشتر فعالیت‌های روزانه‌ام را با تحرک و انرژی شروع می‌کنم.",
      "روز را معمولاً با انرژی و جنب‌وجوش آغاز می‌کنم.",
      "برای شروع کارها، حس تحرک و سرزندگی دارم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "A",
    facet: "respect",
    reverse: true,
    prompts: [
      "اگر حوصله‌ام سر برود، حرف کسی را قطع می‌کنم.",
      "وقتی حوصله ندارم، ممکن است وسط حرف بقیه بپرم.",
      "با کم‌شدن حوصله، قطع کردن حرف دیگران برایم آسان‌تر می‌شود.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "C",
    facet: "responsibility",
    reverse: false,
    prompts: [
      "مسئولیتی را که پذیرفته‌ام، حتی بدون یادآوری دیگران انجام می‌دهم.",
      "کاری را که قبول کرده‌ام، بدون اینکه کسی پیگیری کند جلو می‌برم.",
      "تعهد پذیرفته‌شده را خودم پیگیری می‌کنم، نه با تذکر دیگران.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "N",
    facet: "lowMood",
    reverse: true,
    prompts: [
      "به‌طور کلی، حال درونی‌ام را خوب توصیف می‌کنم.",
      "در مجموع، حس می‌کنم حال درونی‌ام رو به راه است.",
      "بیشتر اوقات حال درونم را مثبت ارزیابی می‌کنم.",
    ],
  },
  {
    kind: "scored",
    format: "agreement",
    domain: "O",
    facet: "imagination",
    reverse: false,
    prompts: [
      "ایده‌ها یا راه‌های تازه، خودبه‌خود به ذهنم می‌رسند.",
      "بدون تلاش زیاد، پیشنهادها و مسیرهای تازه به سرم می‌آید.",
      "ذهنم معمولاً خودش راه یا ایدهٔ جدید می‌سازد.",
    ],
  },
  {
    kind: "open",
    format: "situational",
    prompts: [
      "در صف اداره یا کار اداری باید بین دو گزینه سریع تصمیم بگیری؛ اطلاعاتت کامل نیست و وقت هم محدود است. معمولاً چه می‌کنی؟",
      "باید زود یکی از دو راه را انتخاب کنی، ولی دادهٔ کامل نداری و زمان کم است. واکنش‌ات چیست؟",
      "در یک موقعیت اداری فوری، دو گزینه داری و ابهام باقی است. معمولاً چطور پیش می‌روی؟",
    ],
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

function buildItem(draft: ScoredDraft | OpenDraft, index: number, promptIndex = 0): Item {
  const order = index + 1;
  const id = `q${String(order).padStart(2, "0")}`;
  const prompts = draft.prompts;
  const prompt = prompts[Math.min(promptIndex, prompts.length - 1)] ?? prompts[0]!;

  if (draft.kind === "scored") {
    return {
      id,
      order,
      format: draft.format,
      prompt,
      promptVariants: prompts,
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
    prompt,
    promptVariants: prompts,
    options: draft.options.map((option, optionIndex) => ({
      value: optionIndex + 1,
      label: option.label,
      tag: option.tag,
    })),
    scored: false,
  };
}

/** Canonical instrument (first wording of each item). Used for scoring metadata and checks. */
export const ITEMS: Item[] = drafts.map((draft, index) => buildItem(draft, index, 0));

function randomIndex(size: number): number {
  if (size <= 1) return 0;
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const bucket = new Uint32Array(1);
    crypto.getRandomValues(bucket);
    return bucket[0]! % size;
  }
  return Math.floor(Math.random() * size);
}

/** Pick one wording per item for this browser session (stable until cleared). */
export function getSessionItems(): Item[] {
  if (typeof window === "undefined") return ITEMS;

  let chosen: Record<string, number> | null = null;
  const raw = sessionStorage.getItem(PROMPT_VARIANTS_KEY);
  if (raw) {
    try {
      chosen = JSON.parse(raw) as Record<string, number>;
    } catch {
      chosen = null;
    }
  }

  if (!chosen || typeof chosen !== "object") {
    chosen = {};
    drafts.forEach((draft, index) => {
      const id = `q${String(index + 1).padStart(2, "0")}`;
      chosen![id] = randomIndex(draft.prompts.length);
    });
    sessionStorage.setItem(PROMPT_VARIANTS_KEY, JSON.stringify(chosen));
  }

  return drafts.map((draft, index) => {
    const id = `q${String(index + 1).padStart(2, "0")}`;
    const promptIndex = chosen![id] ?? 0;
    return buildItem(draft, index, promptIndex);
  });
}

/** Clear wording picks so the next test run draws fresh variants. */
export function resetSessionPromptVariants(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROMPT_VARIANTS_KEY);
}

export function itemById(id: string): Item {
  const item = ITEMS.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown item: ${id}`);
  }
  return item;
}
