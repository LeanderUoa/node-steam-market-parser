import { scrape } from './scrape';
import { compare } from './compare';
import { initSteamThen, initCsgoThen } from "./steamUser";
import { sleep, sleepWithProgress } from '../src/customUtils';

const fs = require('fs');
const path = require('path');

const fails_filepath = path.resolve(process.cwd(), 'fails_per_cycle.csv');


async function start() {
    await initSteamThen(() => {initCsgoThen(main)});
}

export const searchInfo: { [key: string]: { priceThreshold: number; wearThreshold: number, searchOffsets? : number } } = {
    "Glock-18 | Snack Attack (Minimal Wear)": {
        priceThreshold: 70,
        wearThreshold: 0.115
    },
    "MAC-10 | Toybox (Minimal Wear)": {
        priceThreshold: 70,
        wearThreshold: 0.115
    },
    "UMP-45 | Neo-Noir (Minimal Wear)": {
        priceThreshold: 39,
        wearThreshold: 0.12
    },
    "UMP-45 | Neo-Noir (Minimal Wear) ": {
        priceThreshold: 50,
        wearThreshold: 0.105,
        searchOffsets: 2
    },
    "G3SG1 | The Executioner (Field-Tested)": {
        priceThreshold: 33,
        wearThreshold: 0.22,
        searchOffsets: 2
    },
    "P90 | Shapewood (Minimal Wear)": {
        priceThreshold: 33,
        wearThreshold: 0.11
    },
    "Sawed-Off | Wasteland Princess (Minimal Wear)": {
        priceThreshold: 83,
        wearThreshold: 0.097
    },
    "P90 | Shallow Grave (Minimal Wear)": {
        priceThreshold: 83,
        wearThreshold: 0.1
    }
};

// Main function to start the scraping process
export async function main() {
    while (true) {
        var count_errors = 0;
        for (const itemName in searchInfo) {

            count_errors += await checkItem(itemName.trim(), searchInfo[itemName].searchOffsets ?? 1);

            await sleep(500);
            
        }
        
        const output = `${count_errors / Object.keys(searchInfo).length}\n`;
        fs.appendFileSync(fails_filepath, output, 'utf8');
        await sleepWithProgress(10);
    }
}

async function checkItem(itemName : string, noOffsets : number) : Promise<number> {
    let j = 0;
    let count_errors = 0;
    while (j < (noOffsets)) {
        try {
            await scrape(itemName, j * 20).then(async results => {
                for (let i = 0; i < results.length; i++) {
                    
                    const [price, link] = results[i];
                    if (compare(link, itemName, price)) {
                        await sleep(1000);                    
                    } else {
                        // console.log(`Duplicate link found, skipping: ${link}`);     
                        continue               
                    }
                }
            });
            j += 1;
            
        } catch (error) {
            console.error('Error occurred:', error);
            count_errors += 1;
            await sleep(2000); // Wait between item checks to avoid rate limiting

            continue

        }
    }
    return count_errors;
}

// Execute the main function
start();