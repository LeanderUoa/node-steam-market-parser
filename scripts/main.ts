import { scrape } from './scrape';
import { compare } from './compare';
import { initSteamThen, initCsgoThen } from "./steamUser";
import { sleep, sleepWithProgress, timeout } from '../src/customUtils';

const fs = require('fs');
const path = require('path');

const fails_filepath = path.resolve(process.cwd(), 'fails_per_cycle.csv');

let previous_price = 0;

async function start() {
    await initSteamThen(() => {initCsgoThen(main)});
}

export const searchInfo: { [key: string]: {searchOffsets? : number, info : { priceThreshold: number; wearThreshold: number}[]} } = {
    "Glock-18 | Snack Attack (Minimal Wear)": {info: [{
        priceThreshold: 70,
        wearThreshold: 0.115
    }]},
    "MAC-10 | Toybox (Minimal Wear)": {info: [{
        priceThreshold: 70,
        wearThreshold: 0.115
    }]},
    "UMP-45 | Neo-Noir (Minimal Wear)": {
        searchOffsets: 2,
        info: [{
            priceThreshold: 51,
            wearThreshold: 0.105,
        }, {
            priceThreshold: 43,
            wearThreshold: 0.12
        }]},
    "Sawed-Off | Wasteland Princess (Minimal Wear)": {info: [{
        priceThreshold: 89,
        wearThreshold: 0.097
    }]},
    "P90 | Shallow Grave (Minimal Wear)": {info: [{
        priceThreshold: 89,
        wearThreshold: 0.105
    }]}
};

// Main function to start the scraping process
export async function main() {
    while (true) {
        var count_errors = 0;
        for (const itemName in searchInfo) {
            count_errors += await checkItem(itemName.trim(), searchInfo[itemName].searchOffsets ?? 1);
        }
        
        const output = `${count_errors / Object.keys(searchInfo).length}\n`;
        fs.appendFileSync(fails_filepath, output, 'utf8');
        await sleepWithProgress(100);
    }
}

async function checkItem(itemName : string, noOffsets : number){
    let j = 0;
    let count_errors = 0;
    previous_price = 0;
    while (j < noOffsets) {
        try {
            await Promise.race([
                (async () => {
                    const results = await scrape(itemName, j * 20);
                    for (let i = 0; i < results.length; i++) {
                        const [price, link] = results[i];
                        for (const info of searchInfo[itemName].info) {
                            const goalPrice = info.priceThreshold;
                            const goalFloat = info.wearThreshold;
                            if (compare(link, itemName, price, goalPrice, goalFloat, previous_price)) {
                                await sleep(300);
                                previous_price = price;
                            }
                        }
                    }
                    j += 1;
                })(),
                timeout(10_000) // 10 seconds
            ]);
        } catch (error) {
            console.error('Error occurred:', error);
            count_errors += 1;
            await sleep(700); // Wait to avoid rate limiting
            continue;
        }
    }
    
    return count_errors;
}

// Execute the main function
start();