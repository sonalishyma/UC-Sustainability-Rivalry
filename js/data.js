/* UC Sustainability Rivalry — real dataset
   Source: Team 3 Metrics Data Chart.xlsx (SYN 100, Team 3).
   Nine of the ten UC campuses — every campus with an undergraduate
   class — ranked 1–9 (1 = best) on seven public sustainability metrics.
   UCSF is a health-sciences-only campus and isn't part of this comparison. */

const CAMPUSES = {
  UCSD: { name: "UC San Diego",     home: true  },
  UCI:  { name: "UC Irvine"                     },
  UCB:  { name: "UC Berkeley"                   },
  UCM:  { name: "UC Merced"                     },
  UCD:  { name: "UC Davis"                      },
  UCSB: { name: "UC Santa Barbara"               },
  UCSC: { name: "UC Santa Cruz"                  },
  UCLA: { name: "UCLA"                          },
  UCR:  { name: "UC Riverside"                   },
};

/* Rank 1–9 on each metric (1 = best), plus the summed total (lower = better). */
const RANKS = {
  UCSD: { buildings: 3, emissions: 6, eui: 5, water: 1, curriculum: 1, air: 5, waste: 7, total: 28 },
  UCI:  { buildings: 5, emissions: 3, eui: 6, water: 2, curriculum: 2, air: 7, waste: 2, total: 27 },
  UCB:  { buildings: 7, emissions: 8, eui: 7, water: 4, curriculum: 4, air: 6, waste: 1, total: 37 },
  UCM:  { buildings: 6, emissions: 2, eui: 9, water: 9, curriculum: 3, air: 1, waste: 3, total: 33 },
  UCD:  { buildings: 4, emissions: 4, eui: 3, water: 6, curriculum: 6, air: 4, waste: 9, total: 36 },
  UCSB: { buildings: 1, emissions: 1, eui: 2, water: 8, curriculum: 8, air: 2, waste: 5, total: 27 },
  UCSC: { buildings: 8, emissions: 5, eui: 8, water: 5, curriculum: 5, air: 8, waste: 4, total: 43 },
  UCLA: { buildings: 2, emissions: 9, eui: 4, water: 7, curriculum: 9, air: 3, waste: 6, total: 40 },
  UCR:  { buildings: 9, emissions: 7, eui: 1, water: 3, curriculum: 7, air: 9, waste: 8, total: 44 },
};

const METRICS = [
  { key: "buildings",  label: "Buildings",       short: "Bldgs", desc: "LEED-certified stock, weighted Platinum ×4 / Gold ×3 / Silver ×2 / Certified ×1." },
  { key: "emissions",  label: "Emissions",       short: "Emiss", desc: "Composite proxy: (Scope 1–3 emissions − renewable energy use) per acre. Lower is better." },
  { key: "eui",        label: "Energy intensity", short: "EUI",   desc: "Actual energy-use intensity vs. the campus’s own target." },
  { key: "water",      label: "Water",           short: "Water", desc: "Water use vs. the campus’s 2025 goal (gallons per capita, as recorded)." },
  { key: "curriculum", label: "Curriculum",      short: "Curric", desc: "STARS curriculum & campus engagement, % of possible points." },
  { key: "air",        label: "Air & climate",   short: "Air",   desc: "STARS air/energy & climate, normalized to % of possible (two STARS versions)." },
  { key: "waste",      label: "Waste",           short: "Waste", desc: "STARS waste score, % of possible points." },
];

/* Underlying real numbers behind each rank, for tooltips + deep-dive charts. */
const RAW = {
  buildings: { // total buildings, platinum, gold, silver, certified, weighted score
    UCSB: { total: 76, platinum: 9,  gold: 45, silver: 20, certified: 2, score: 213 },
    UCLA: { total: 68, platinum: 20, gold: 34, silver: 11, certified: 3, score: 207 },
    UCSD: { total: 63, platinum: 14, gold: 36, silver: 9,  certified: 4, score: 186 },
    UCD:  { total: 54, platinum: 11, gold: 29, silver: 13, certified: 1, score: 158 },
    UCI:  { total: 42, platinum: 16, gold: 17, silver: 6,  certified: 3, score: 130 },
    UCM:  { total: 32, platinum: 7,  gold: 18, silver: 7,  certified: 0, score: 96  },
    UCB:  { total: 31, platinum: 8,  gold: 14, silver: 9,  certified: 0, score: 92  },
    UCSC: { total: 20, platinum: 5,  gold: 11, silver: 4,  certified: 0, score: 61  },
    UCR:  { total: 19, platinum: 6,  gold: 7,  silver: 3,  certified: 3, score: 54  },
  },
  emissions: { // scope 1-3 emissions & renewable energy use (as reported, 2023), acres, composite score
    UCSB: { scope: 33529,  renewable: 79635,  acres: 1055, score: -43.70 },
    UCM:  { scope: 19295,  renewable: 37447,  acres: 1026, score: -17.69 },
    UCI:  { scope: 107174, renewable: 87197,  acres: 1582, score: 12.63  },
    UCD:  { scope: 215501, renewable: 133168, acres: 5300, score: 15.53  },
    UCSC: { scope: 51929,  renewable: 19901,  acres: 2001, score: 16.01  },
    UCSD: { scope: 232646, renewable: 138414, acres: 2178, score: 43.27  },
    UCR:  { scope: 82222,  renewable: 11438,  acres: 1200, score: 58.99  },
    UCB:  { scope: 166573, renewable: 17905,  acres: 1232, score: 120.67 },
    UCLA: { scope: 311720, renewable: 57540,  acres: 419,  score: 606.63 },
  },
  eui: { // energy use intensity: target vs actual (diff = actual - target, computed live —
         // the source workbook's own "Difference" column has a couple of sign errors,
         // e.g. it lists UCI as +3 and UCSB as -2 even though actual - target is -3 and +2)
    UCR:  { target: 107, actual: 102 },
    UCSB: { target: 72,  actual: 74  },
    UCD:  { target: 129, actual: 128 },
    UCLA: { target: 136, actual: 136 },
    UCSD: { target: 149, actual: 151 },
    UCI:  { target: 119, actual: 116 },
    UCB:  { target: 146, actual: 157 },
    UCSC: { target: 90,  actual: 107 },
    UCM:  { target: 67,  actual: 97  },
  },
  water: { // gallons per capita: 2025 goal, actual, difference, whether goal was exact or approximated
    UCSD: { goal: 14500, actual: 10538, diff: -3962, approx: true  },
    UCI:  { goal: 12197, actual: 9913,  diff: -2284, approx: false },
    UCR:  { goal: 15500, actual: 14185, diff: -1315, approx: true  },
    UCB:  { goal: 13105, actual: 12119, diff: -986,  approx: false },
    UCSC: { goal: 9000,  actual: 8174,  diff: -826,  approx: true  },
    UCD:  { goal: 18250, actual: 17656, diff: -594,  approx: true  },
    UCLA: { goal: 10700, actual: 11480, diff: 780,   approx: true  },
    UCSB: { goal: 7000,  actual: 8439,  diff: 1439,  approx: true  },
    UCM:  { goal: 13000, actual: 17259, diff: 4259,  approx: true  },
  },
  curriculum: { // STARS curriculum & campus engagement, % of possible
    UCSD: 0.963, UCI: 0.937, UCM: 0.918, UCB: 0.893, UCSC: 0.805,
    UCD: 0.789, UCR: 0.752, UCSB: 0.714, UCLA: 0.627,
  },
  waste: { // STARS waste score, % of possible
    UCB: 0.841, UCI: 0.776, UCM: 0.763, UCSC: 0.762, UCSB: 0.760,
    UCLA: 0.750, UCSD: 0.730, UCR: 0.675, UCD: 0.513,
  },
  air: { // STARS air/energy & climate, % of possible (normalized across two STARS versions)
    UCM: 0.928, UCSB: 0.769, UCLA: 0.665, UCD: 0.629, UCSD: 0.603,
    UCB: 0.572, UCI: 0.539, UCSC: 0.532, UCR: 0.488,
  },
};

const SOURCES = [
  { label: "UC Office of the President — Annual Sustainability Report (2025)", url: "https://sustainabilityreport.ucop.edu/2025/policy-progress/" },
  { label: "UCOP — Sustainability rankings, ratings & awards (FY 2024–25)", url: "https://www.ucop.edu/sustainability/_files/2024-25-fy-sustainability-rankings-ratings-and-awards.pdf" },
  { label: "AASHE STARS public campus reports", url: "https://reports.aashe.org/" },
  { label: "USGBC — Why certify with LEED", url: "https://www.usgbc.org/articles/top-10-reasons-certify-leed" },
];
