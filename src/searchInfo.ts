const assorted = {   
    "★ Driver Gloves | King Snake (Field-Tested)": {
        info: [{
            priceThreshold: 750,
            wearThreshold: 0.2,
        }, {
            priceThreshold: 650,
            wearThreshold: 0.23
        }, {
            priceThreshold: 600,
            wearThreshold: 0.26
        }]},
    "P250 | Visions (Factory New)": {
        info: [{
            priceThreshold: 40,
            wearThreshold: 0.017,
        }]
    },
    "Sawed-Off | Kiss♥Love (Factory New)": {
        info: [{
            priceThreshold: 43,
            wearThreshold: 0.02,
        }]
    },
    "MP7 | Abyssal Apparition (Factory New)": {
        info: [{
            priceThreshold: 43,
            wearThreshold: 0.02,
        }]

    }
};

const leet_museo = {
    "MAC-10 | Toybox (Minimal Wear)": {info: [{
        priceThreshold: 75,
        wearThreshold: 0.115
    }]},
    // "Glock-18 | Snack Attack (Minimal Wear)": {info: [{
    //     priceThreshold: 75,
    //     wearThreshold: 0.115
    // }]}
}

const buzz_kill = {
    "Sawed-Off | Wasteland Princess (Minimal Wear)": {info: [{
        priceThreshold: 135,
        wearThreshold: 0.092
    }]},
    "P90 | Shallow Grave (Minimal Wear)": {info: [{
        priceThreshold: 135,
        wearThreshold: 0.09
    }]}
}

const vaporwave = {
    "UMP-45 | Neo-Noir (Minimal Wear)": {
        searchOffsets: 2,
        info: [{
            priceThreshold: 50,
            wearThreshold: 0.105,
        }, {
            priceThreshold: 37,
            wearThreshold: 0.123
        }]},
}

const revo_glove_tradeup = {
    "AK-47 | Head Shot (Minimal Wear)": {info: [{
        priceThreshold: 143,
        wearThreshold: 0.122
    }]},
    "MP7 | Bloodsport (Minimal Wear)": {
        info: [{
            priceThreshold: 132,
            wearThreshold: 0.093,
        }, {
            priceThreshold: 143,
            wearThreshold: 0.08
    }]},
    "M4A4 | Temukau (Minimal Wear)": {
        info: [{
            priceThreshold: 143,
            wearThreshold: 0.097
        }, {
            priceThreshold: 132,
            wearThreshold: 0.11
    }]},
    // "M4A4 | Neo-Noir (Minimal Wear)": {info: [{
    //     priceThreshold: 152,
    //     wearThreshold: 0.109
    // }]}
}

const recoil_glove_tradeup = {
    "USP-S | Printstream (Minimal Wear)": {
        info: [{
            priceThreshold: 135,
            wearThreshold: 0.11
        }]
    }
};

export const searchInfo: { [key: string]: {searchOffsets? : number, info : { priceThreshold: number; wearThreshold: number}[]} } = {...revo_glove_tradeup, ...recoil_glove_tradeup};