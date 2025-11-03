export interface MatchPair {
  id: number;
  type: string;
  a: string;
  b: string;
  relationship: string;
  verse: string;
  note: string;
}

export const matchPairs: MatchPair[] = [
  {
    id: 1,
    type: "pair",
    a: "Elijah",
    b: "Elisha",
    relationship: "mentor",
    verse: "2 Kings 2:9",
    note: "Elijah passed his mantle to Elisha, who received a double portion of his spirit.",
  },
  {
    id: 2,
    type: "pair",
    a: "Moses",
    b: "Aaron",
    relationship: "brothers",
    verse: "Exodus 4:14",
    note: "Aaron was Moses' brother and spokesman before Pharaoh.",
  },
  {
    id: 3,
    type: "pair",
    a: "David",
    b: "Jonathan",
    relationship: "friendship",
    verse: "1 Samuel 18:1",
    note: "David and Jonathan formed a covenant of loyal friendship.",
  },
  {
    id: 4,
    type: "pair",
    a: "Paul",
    b: "Barnabas",
    relationship: "missionary_partners",
    verse: "Acts 13:2",
    note: "The Holy Spirit set apart Paul and Barnabas for missionary work.",
  },
  {
    id: 5,
    type: "pair",
    a: "Naomi",
    b: "Ruth",
    relationship: "family_loyalty",
    verse: "Ruth 1:16",
    note: "Ruth vowed to stay with Naomi, declaring 'Your people shall be my people.'",
  },
  {
    id: 6,
    type: "pair",
    a: "Abraham",
    b: "Lot",
    relationship: "uncle_nephew",
    verse: "Genesis 13:8",
    note: "Abraham and Lot separated peacefully to avoid strife among their herdsmen.",
  },
  {
    id: 7,
    type: "pair",
    a: "Jacob",
    b: "Esau",
    relationship: "brothers",
    verse: "Genesis 25:25",
    note: "Twin sons of Isaac who struggled over the birthright.",
  },
  {
    id: 8,
    type: "pair",
    a: "Peter",
    b: "John",
    relationship: "companions",
    verse: "Acts 3:1",
    note: "Peter and John went together to the temple at the hour of prayer.",
  },
  {
    id: 9,
    type: "pair",
    a: "Mary",
    b: "Martha",
    relationship: "sisters",
    verse: "Luke 10:38-42",
    note: "Martha served while Mary listened to Jesus' teaching.",
  },
  {
    id: 10,
    type: "pair",
    a: "Paul",
    b: "Timothy",
    relationship: "mentor",
    verse: "2 Timothy 1:2",
    note: "Paul referred to Timothy as his true son in the faith.",
  },
];
