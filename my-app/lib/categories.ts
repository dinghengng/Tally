export const CATEGORIES = [
  "Food",
  "Transport",
  "Subscriptions",
  "School",
  "Fun",
  "Shopping",
  "Other",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#e4572e",
  Transport: "#2a6f97",
  Subscriptions: "#7b5ea7",
  School: "#2f9e6f",
  Fun: "#e0a100",
  Shopping: "#c2457d",
  Other: "#7a8a90",
};

const KEYWORDS: [string, RegExp][] = [
  ["Food", /lunch|dinner|breakfast|canteen|cafe|coffee|kopi|bubble tea|grocer|mart|supper|food|hawker/i],
  ["Transport", /bus|mrt|grab|taxi|gojek|transport|ez-?link|top-?up/i],
  ["Subscriptions", /spotify|netflix|youtube|icloud|subscription|premium|chatgpt/i],
  ["School", /textbook|print|stationery|course|tuition|lab|book/i],
  ["Fun", /movie|cinema|game|concert|karaoke|club|steam/i],
  ["Shopping", /shopee|lazada|uniqlo|clothes|amazon|shoes/i],
];

export function guessCategory(description: string): string {
  for (const [category, pattern] of KEYWORDS) {
    if (pattern.test(description)) return category;
  }
  return "Other";
}
