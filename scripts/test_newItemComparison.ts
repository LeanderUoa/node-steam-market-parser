import { compareAndNotify } from "./compare";
import { searchInfo } from "../src/searchInfo";

// --- Mock notifyAndWrite so we can see output ---
(global as any).notifyAndWrite = (
    item: string,
    price: number,
    wear: number,
    msg: string
) => {
    console.log(">>> NOTIFY:", msg);
};

function run(label: string, fn: () => void) {
    console.log(`\n=== ${label} ===`);
    fn();
}

// Pick AK Head Shot (or the first item if ordering changes)
const testItem = "AK-47 | Head Shot (Minimal Wear)";
const impl = searchInfo[testItem].implementation;

// Helper: compute expected price from formula
function akPrice(wear: number) {
    return 210.50 - 456.98 * wear;
}

// ---------------------------
//    Example test values
// ---------------------------

// Wear values around the two datapoints:
//
// wear 0.0997 → 165
// wear 0.1216 → 155
//
// So we pick:
// - slightly below best point
// - slightly above worst point
// - around middle
// - too expensive
// - too high wear

const tests = [
    {
        label: "wear=0.10 price=160 → should notify (price < expected)",
        wear: 0.101,
        price: 160,                      // expected ~164.8
        should: "notify"
    },
    {
        label: "wear=0.10 price=180 → should NOT notify (price too high)",
        wear: 0.101,
        price: 180,                      // expected ~164.8
        should: "not"
    },
    {
        label: "wear=0.12 price=150 → should notify",
        wear: 0.121,
        price: 150,                      // expected ~155.6
        should: "notify"
    },
    {
        label: "wear=0.12 price=170 → should NOT notify",
        wear: 0.121,
        price: 170,
        should: "not"
    },
    {
        label: "wear borderline high 0.14 price=140 → should NOT notify (wear too high)",
        wear: 0.141,
        price: 140,
        should: "not"
    },
    {
        label: "good wear but NaN price → should notify fallback",
        wear: 0.1111,
        price: NaN,
        should: "notify"
    }
];

// ---------------------------
//           RUN
// ---------------------------

for (const t of tests) {
    run(t.label, () => {
        compareAndNotify(
            testItem,
            t.price,
            t.wear,
            impl,
            155
        );
    });
}
