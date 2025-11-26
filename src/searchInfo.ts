import { ThresholdImplementation, FormulaImplementation, ComparisonImplementation } from "./itemComparison";

const assorted = {   
    "★ Driver Gloves | King Snake (Field-Tested)": {
        implementation: new ThresholdImplementation([
            { priceThreshold: 750, wearThreshold: 0.2 },
            { priceThreshold: 650, wearThreshold: 0.23 },
            { priceThreshold: 600, wearThreshold: 0.26 }
        ])
    },
    "P250 | Visions (Factory New)": {
        implementation: new ThresholdImplementation([
            { priceThreshold: 40, wearThreshold: 0.017 }
        ])
    },
    "Sawed-Off | Kiss♥Love (Factory New)": {
        implementation: new ThresholdImplementation([
            { priceThreshold: 43, wearThreshold: 0.02 }
        ])
    },
    "MP7 | Abyssal Apparition (Factory New)": {
        implementation: new ThresholdImplementation([
            { priceThreshold: 43, wearThreshold: 0.02 }
        ])
    }
};

const leet_museo = {
    "MAC-10 | Toybox (Minimal Wear)": {
        implementation: new ThresholdImplementation([
            { priceThreshold: 75, wearThreshold: 0.115 }
        ])
    }
};

const buzz_kill = {
    "Sawed-Off | Wasteland Princess (Minimal Wear)": {
        implementation: new ThresholdImplementation([
            { priceThreshold: 135, wearThreshold: 0.092 }
        ])
    },
    "P90 | Shallow Grave (Minimal Wear)": {
        implementation: new ThresholdImplementation([
            { priceThreshold: 135, wearThreshold: 0.09 }
        ])
    }
};

const vaporwave = {
    "UMP-45 | Neo-Noir (Minimal Wear)": {
        searchOffsets: 2,
        implementation: new ThresholdImplementation([
            { priceThreshold: 50, wearThreshold: 0.105 },
            { priceThreshold: 37, wearThreshold: 0.123 }
        ])
    }
};

const revo_glove_tradeup = {
    "AK-47 | Head Shot (Minimal Wear)": {
        implementation: new FormulaImplementation(
            { price: 165, wear: 0.0997297 },
            { price: 155, wear: 0.1216216 }
        )
    },

    "MP7 | Bloodsport (Minimal Wear)": {
        implementation: new FormulaImplementation(
            { price: 165, wear: 0.0648243 },
            { price: 155, wear: 0.0790541 }
        )
    },

    // "M4A4 | Neo-Noir (Minimal Wear)": {
    //     implementation: new FormulaImplementation(
    //         { price: 165, wear: 0.0897568 },
    //         { price: 155, wear: 0.1094595 }
    //     )
    // },

    "M4A4 | Temukau (Minimal Wear)": {
        implementation: new FormulaImplementation(
            { price: 165, wear: 0.0797838 },
            { price: 155, wear: 0.0972973 }
        )
    }
};

const recoil_glove_tradeup = {
    "USP-S | Printstream (Minimal Wear)": {
        implementation: new FormulaImplementation(
            { price: 165, wear: 0.0847703 },
            { price: 155, wear: 0.1033784 }
        )
    }
};

interface SearchEntry {
    searchOffsets?: number;
    implementation: ComparisonImplementation;
}

export const searchInfo: Record<string, SearchEntry> = {
    ...revo_glove_tradeup,
    ...recoil_glove_tradeup
};
