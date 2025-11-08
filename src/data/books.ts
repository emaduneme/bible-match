export type Testament = "OT" | "NT";

export interface BibleBookInfo {
  name: string;
  aliases: string[];
  testament: Testament;
  collection:
    | "Pentateuch"
    | "Historical"
    | "Wisdom"
    | "Major Prophets"
    | "Minor Prophets"
    | "Gospels"
    | "Acts"
    | "Pauline Epistles"
    | "General Epistles"
    | "Revelation";
}

import BOOKS from "./books.json";
export const BIBLE_BOOKS: BibleBookInfo[] = BOOKS as unknown as BibleBookInfo[];

export function findBookInfoFromReference(ref: string): BibleBookInfo | undefined {
  // Match references like \"1 Samuel 18:1\" or \"Genesis 12:1\" or \"Luke 10:38-42\"
  const trimmed = ref.trim();
  // try longest names first to catch \"1 Samuel\" etc.
  const candidates = [...BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length);
  for (const b of candidates) {
    if (trimmed.startsWith(b.name)) return b;
    if (b.aliases.some((a) => trimmed.startsWith(a))) return b;
  }
  return undefined;
}


