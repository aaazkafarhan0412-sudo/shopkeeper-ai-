export type TxnType = "credit" | "payment" | "opening";

export type Txn = {
  id: string;
  label: string;
  type: TxnType;
  amount: number;
  date: string;
  running: number;
  note?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  area: string;
  balance: number;
  status: "clear" | "due" | "overdue";
  last: string;
  since: string;
  txns: Txn[];
};

/** Pakistani (lakh/crore) digit grouping, e.g. 184500 -> 1,84,500 */
export function groupPKR(n: number): string {
  const neg = n < 0;
  const s = Math.abs(Math.round(n)).toString();
  let out = s;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    out = rest + "," + last3;
  }
  return (neg ? "-" : "") + out;
}

export function pkr(n: number): string {
  return "Rs. " + groupPKR(n);
}

export const customers: Customer[] = [
  {
    id: "ahmed",
    name: "Ahmed Khan",
    phone: "+92 300 4412889",
    area: "Gulberg III, Lahore",
    balance: 4500,
    status: "due",
    last: "18 Mar",
    since: "Customer since 2021",
    txns: [
      { id: "a0", label: "Opening balance", type: "opening", amount: 2100, date: "02 Mar", running: 2100, note: "Purana khata" },
      { id: "a1", label: "Grocery", type: "credit", amount: 1200, date: "05 Mar", running: 3300 },
      { id: "a2", label: "Payment", type: "payment", amount: 500, date: "09 Mar", running: 2800, note: "Cash" },
      { id: "a3", label: "Grocery", type: "credit", amount: 2000, date: "14 Mar", running: 4800 },
      { id: "a4", label: "Payment", type: "payment", amount: 300, date: "18 Mar", running: 4500, note: "EasyPaisa" },
    ],
  },
  {
    id: "usman",
    name: "Muhammad Usman",
    phone: "+92 345 9081123",
    area: "DHA Phase 5, Karachi",
    balance: 8900,
    status: "overdue",
    last: "04 Mar",
    since: "Customer since 2019",
    txns: [
      { id: "u0", label: "Opening balance", type: "opening", amount: 6400, date: "28 Feb", running: 6400 },
      { id: "u1", label: "Monthly ration", type: "credit", amount: 3500, date: "01 Mar", running: 9900 },
      { id: "u2", label: "Payment", type: "payment", amount: 1000, date: "04 Mar", running: 8900, note: "Bank transfer" },
    ],
  },
  {
    id: "fatima",
    name: "Fatima Bibi",
    phone: "+92 333 2208841",
    area: "Saddar, Rawalpindi",
    balance: 1250,
    status: "due",
    last: "19 Mar",
    since: "Customer since 2023",
    txns: [
      { id: "f1", label: "Grocery", type: "credit", amount: 2250, date: "11 Mar", running: 2250 },
      { id: "f2", label: "Payment", type: "payment", amount: 1000, date: "19 Mar", running: 1250, note: "Cash" },
    ],
  },
  {
    id: "kashif",
    name: "Kashif Traders",
    phone: "+92 301 6634477",
    area: "Bolton Market, Karachi",
    balance: 24750,
    status: "overdue",
    last: "02 Mar",
    since: "Wholesale account · 2018",
    txns: [
      { id: "k1", label: "Wholesale stock", type: "credit", amount: 19350, date: "24 Feb", running: 19350 },
      { id: "k2", label: "Wholesale stock", type: "credit", amount: 5400, date: "02 Mar", running: 24750 },
    ],
  },
  {
    id: "zainab",
    name: "Zainab Mart",
    phone: "+92 336 2211908",
    area: "Johar Town, Lahore",
    balance: 3600,
    status: "due",
    last: "17 Mar",
    since: "Customer since 2022",
    txns: [
      { id: "z1", label: "Grocery", type: "credit", amount: 5850, date: "10 Mar", running: 5850 },
      { id: "z2", label: "Payment", type: "payment", amount: 2250, date: "17 Mar", running: 3600, note: "JazzCash" },
    ],
  },
  {
    id: "bilal",
    name: "Bilal Ahmed",
    phone: "+92 321 7745012",
    area: "Model Town, Lahore",
    balance: 0,
    status: "clear",
    last: "Today",
    since: "Customer since 2020",
    txns: [
      { id: "b1", label: "Grocery", type: "credit", amount: 3000, date: "12 Mar", running: 3000 },
      { id: "b2", label: "Payment", type: "payment", amount: 3000, date: "Today", running: 0, note: "Cash · full" },
    ],
  },
  {
    id: "ayesha",
    name: "Ayesha Siddiqui",
    phone: "+92 312 4478920",
    area: "Clifton, Karachi",
    balance: 0,
    status: "clear",
    last: "Today",
    since: "Customer since 2024",
    txns: [
      { id: "ay1", label: "Grocery", type: "credit", amount: 6500, date: "08 Mar", running: 6500 },
      { id: "ay2", label: "Payment", type: "payment", amount: 6500, date: "Today", running: 0, note: "Bank transfer" },
    ],
  },
  {
    id: "sana",
    name: "Sana Ullah",
    phone: "+92 344 3312207",
    area: "Hayatabad, Peshawar",
    balance: 6200,
    status: "due",
    last: "16 Mar",
    since: "Customer since 2021",
    txns: [
      { id: "s1", label: "Grocery", type: "credit", amount: 1400, date: "16 Mar", running: 6200 },
    ],
  },
];

export type FeedItem = {
  id: number;
  name: string;
  kind: "credit" | "payment";
  amount: number;
  when: string;
};

export const feed: FeedItem[] = [
  { id: 1, name: "Bilal Ahmed", kind: "payment", amount: 3000, when: "2 min ago" },
  { id: 2, name: "Kashif Traders", kind: "credit", amount: 5400, when: "18 min ago" },
  { id: 3, name: "Fatima Bibi", kind: "payment", amount: 1000, when: "42 min ago" },
  { id: 4, name: "Zainab Mart", kind: "credit", amount: 2250, when: "1 hr ago" },
  { id: 5, name: "Ayesha Siddiqui", kind: "payment", amount: 6500, when: "2 hr ago" },
  { id: 6, name: "Muhammad Usman", kind: "credit", amount: 850, when: "3 hr ago" },
  { id: 7, name: "Sana Ullah", kind: "credit", amount: 1400, when: "Today, 9:41 am" },
];

export const tickerPool: Omit<FeedItem, "id">[] = [
  { name: "Imran Qureshi", kind: "payment", amount: 2500, when: "Just now" },
  { name: "Nadeem Store", kind: "credit", amount: 4100, when: "Just now" },
  { name: "Haji Abdul Rasheed", kind: "payment", amount: 8000, when: "Just now" },
  { name: "Rabia Begum", kind: "credit", amount: 950, when: "Just now" },
  { name: "Usman Steel Works", kind: "payment", amount: 15000, when: "Just now" },
  { name: "Shabana Kausar", kind: "credit", amount: 1750, when: "Just now" },
];

export const stats = [
  { label: "Total Customers", value: 248, prefix: "", suffix: "", delta: "+12 this month", tone: "olive" as const },
  { label: "Total Receivables", value: 184500, prefix: "Rs. ", suffix: "", delta: "from 36 customers", tone: "flame" as const },
  { label: "Today's Sales", value: 27340, prefix: "Rs. ", suffix: "", delta: "+18% vs yesterday", tone: "olive" as const },
  { label: "Pending Payments", value: 36, prefix: "", suffix: "", delta: "9 due this week", tone: "muted" as const },
];

export const problems = [
  {
    icon: "book" as const,
    n: "01",
    title: "Paper Khata",
    body: "Records can be lost, damaged or difficult to search.",
    detail: "A spilled cup of chai can erase a month of credit.",
  },
  {
    icon: "search" as const,
    n: "02",
    title: "Difficult Tracking",
    body: "Finding an old customer balance takes time.",
    detail: "Pages fill up, handwriting fades, and the shop keeps moving.",
  },
  {
    icon: "bell" as const,
    n: "03",
    title: "Manual Reminders",
    body: "Following up on payments can become difficult.",
    detail: "You remember the balance — but not who to call first.",
  },
];

export const steps = [
  {
    n: "01",
    title: "Add Customer",
    body: "Create a customer profile in seconds.",
    detail: "Name, phone number, area. That is all we ask for.",
  },
  {
    n: "02",
    title: "Record Transaction",
    body: "Add credit, payment or purchase information.",
    detail: "Udhaar, payment or cash sale — one tap each.",
  },
  {
    n: "03",
    title: "Track & Remind",
    body: "Monitor balances and send reminders through WhatsApp.",
    detail: "Balances update instantly. Reminders write themselves.",
  },
];

export const trustPoints = [
  "Simple enough for everyday use",
  "Designed for local businesses",
  "Fast customer search",
  "Easy payment tracking",
  "WhatsApp-friendly",
  "Digital alternative to paper khata",
];

export const faqs = [
  {
    q: "Is Shopkeeper AI free to use?",
    a: "You can start free for 30 days and keep up to 100 customers on the free plan. After that, paid plans start at Rs. 499 per month for unlimited customers and WhatsApp reminders. No card is needed to begin.",
  },
  {
    q: "Do I need internet all the time?",
    a: "No. Every entry is saved on your phone first, so you can keep working during a load-shedding hour or a slow signal. Records sync automatically the moment you are back online.",
  },
  {
    q: "Can I use it in Urdu?",
    a: "Yes. The whole app is available in Urdu, English and Roman Urdu. You can switch at any time, and reminders can be sent in whichever language your customer prefers.",
  },
  {
    q: "How do WhatsApp reminders work?",
    a: "Tap Send Reminder on any customer. Shopkeeper AI writes the message for you — polite, with the correct balance and date. You review it and send it from your own WhatsApp number, so customers hear from you, not from a machine.",
  },
  {
    q: "Is my khata data safe?",
    a: "Your records are encrypted and backed up every night. Only you and the staff members you authorise can open them. You can export a full PDF or Excel khata whenever you want.",
  },
  {
    q: "Will it run on my phone?",
    a: "It works on any Android phone from the last six years and takes less space than a small photo album. An iPhone version and a shop-counter desktop mode are both included.",
  },
];

export const testimonials = [
  {
    quote:
      "Pehle poora register palatna parta tha. Ab customer ka naam likhta hoon aur uska poora hisaab saamne hota hai.",
    translation: "I used to flip through the whole register. Now I type a name and the complete account is in front of me.",
    name: "Haji Abdul Rasheed",
    shop: "Rasheed General Store · Rawalpindi",
    years: "Using Shopkeeper AI for 14 months",
  },
  {
    quote:
      "WhatsApp reminder bhejne ke baad log khud payment le aate hain. Meri bolne ki zehmat khatam.",
    translation: "After the WhatsApp reminder goes out, people bring the payment themselves. No awkward phone calls.",
    name: "Shabana Kausar",
    shop: "Kausar Ladies Tailors · Hyderabad",
    years: "Using Shopkeeper AI for 8 months",
  },
];
