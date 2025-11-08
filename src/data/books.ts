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

// Minimal list covering our current dataset; extend as needed
export const BIBLE_BOOKS: BibleBookInfo[] = [
  { name: "Genesis", aliases: [], testament: "OT", collection: "Pentateuch" },
  { name: "Exodus", aliases: [], testament: "OT", collection: "Pentateuch" },
  { name: "Leviticus", aliases: [], testament: "OT", collection: "Pentateuch" },
  { name: "Numbers", aliases: [], testament: "OT", collection: "Pentateuch" },
  { name: "Deuteronomy", aliases: [], testament: "OT", collection: "Pentateuch" },
  { name: "Joshua", aliases: [], testament: "OT", collection: "Historical" },
  { name: "Judges", aliases: [], testament: "OT", collection: "Historical" },
  { name: "Ruth", aliases: [], testament: "OT", collection: "Historical" },
  { name: "1 Samuel", aliases: ["I Samuel"], testament: "OT", collection: "Historical" },
  { name: "2 Samuel", aliases: ["II Samuel"], testament: "OT", collection: "Historical" },
  { name: "1 Kings", aliases: ["I Kings"], testament: "OT", collection: "Historical" },
  { name: "2 Kings", aliases: ["II Kings"], testament: "OT", collection: "Historical" },
  { name: "1 Chronicles", aliases: ["I Chronicles"], testament: "OT", collection: "Historical" },
  { name: "2 Chronicles", aliases: ["II Chronicles"], testament: "OT", collection: "Historical" },
  { name: "Ezra", aliases: [], testament: "OT", collection: "Historical" },
  { name: "Nehemiah", aliases: [], testament: "OT", collection: "Historical" },
  { name: "Esther", aliases: [], testament: "OT", collection: "Historical" },
  { name: "Job", aliases: [], testament: "OT", collection: "Wisdom" },
  { name: "Psalms", aliases: ["Psalm"], testament: "OT", collection: "Wisdom" },
  { name: "Proverbs", aliases: [], testament: "OT", collection: "Wisdom" },
  { name: "Ecclesiastes", aliases: [], testament: "OT", collection: "Wisdom" },
  { name: "Song of Solomon", aliases: ["Song of Songs"], testament: "OT", collection: "Wisdom" },
  { name: "Isaiah", aliases: [], testament: "OT", collection: "Major Prophets" },
  { name: "Jeremiah", aliases: [], testament: "OT", collection: "Major Prophets" },
  { name: "Lamentations", aliases: [], testament: "OT", collection: "Major Prophets" },
  { name: "Ezekiel", aliases: [], testament: "OT", collection: "Major Prophets" },
  { name: "Daniel", aliases: [], testament: "OT", collection: "Major Prophets" },
  { name: "Hosea", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Joel", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Amos", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Obadiah", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Jonah", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Micah", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Nahum", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Habakkuk", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Zephaniah", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Haggai", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Zechariah", aliases: [], testament: "OT", collection: "Minor Prophets" },
  { name: "Malachi", aliases: [], testament: "OT", collection: "Minor Prophets" },

  { name: "Matthew", aliases: [], testament: "NT", collection: "Gospels" },
  { name: "Mark", aliases: [], testament: "NT", collection: "Gospels" },
  { name: "Luke", aliases: [], testament: "NT", collection: "Gospels" },
  { name: "John", aliases: [], testament: "NT", collection: "Gospels" },
  { name: "Acts", aliases: [], testament: "NT", collection: "Acts" },
  { name: "Romans", aliases: [], testament: "NT", collection: "Pauline Epistles" },
  { name: "1 Corinthians", aliases: ["I Corinthians"], testament: "NT", collection: "Pauline Epistles" },
  { name: "2 Corinthians", aliases: ["II Corinthians"], testament: "NT", collection: "Pauline Epistles" },
  { name: "Galatians", aliases: [], testament: "NT", collection: "Pauline Epistles" },
  { name: "Ephesians", aliases: [], testament: "NT", collection: "Pauline Epistles" },
  { name: "Philippians", aliases: [], testament: "NT", collection: "Pauline Epistles" },
  { name: "Colossians", aliases: [], testament: "NT", collection: "Pauline Epistles" },
  { name: "1 Thessalonians", aliases: ["I Thessalonians"], testament: "NT", collection: "Pauline Epistles" },
  { name: "2 Thessalonians", aliases: ["II Thessalonians"], testament: "NT", collection: "Pauline Epistles" },
  { name: "1 Timothy", aliases: ["I Timothy"], testament: "NT", collection: "Pauline Epistles" },
  { name: "2 Timothy", aliases: ["II Timothy"], testament: "NT", collection: "Pauline Epistles" },
  { name: "Titus", aliases: [], testament: "NT", collection: "Pauline Epistles" },
  { name: "Philemon", aliases: [], testament: "NT", collection: "Pauline Epistles" },
  { name: "Hebrews", aliases: [], testament: "NT", collection: "General Epistles" },
  { name: "James", aliases: [], testament: "NT", collection: "General Epistles" },
  { name: "1 Peter", aliases: ["I Peter"], testament: "NT", collection: "General Epistles" },
  { name: "2 Peter", aliases: ["II Peter"], testament: "NT", collection: "General Epistles" },
  { name: "1 John", aliases: ["I John"], testament: "NT", collection: "General Epistles" },
  { name: "2 John", aliases: ["II John"], testament: "NT", collection: "General Epistles" },
  { name: "3 John", aliases: ["III John"], testament: "NT", collection: "General Epistles" },
  { name: "Jude", aliases: [], testament: "NT", collection: "General Epistles" },
  { name: "Revelation", aliases: ["Revelation of John"], testament: "NT", collection: "Revelation" },
];

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


