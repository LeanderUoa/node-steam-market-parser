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

export const searchInfo: { [key: string]: { priceThreshold: number; wearThreshold: number } } = {
    "Glock-18 | Snack Attack (Minimal Wear)": {
        priceThreshold: 55,
        wearThreshold: 0.115
    },
    "MAC-10 | Toybox (Minimal Wear)": {
        priceThreshold: 55,
        wearThreshold: 0.115
    },
    "UMP-45 | Neo-Noir (Minimal Wear)": {
        priceThreshold: 35,
        wearThreshold: 0.093
    },
    "G3SG1 | The Executioner (Field-Tested)": {
        priceThreshold: 20,
        wearThreshold: 0.22
    },
    "P90 | Shapewood (Minimal Wear)": {
        priceThreshold: 20,
        wearThreshold: 0.11
    },
    "Sawed-Off | Wasteland Princess (Minimal Wear)": {
        priceThreshold: 70,
        wearThreshold: 0.1
    },
    "P90 | Shallow Grave (Minimal Wear)": {
        priceThreshold: 70,
        wearThreshold: 0.1
    }
};

// Main function to start the scraping process
export async function main() {
    while (true) {
        var count_errors = 0;
        for (const itemName in searchInfo) {
            while (true){
                if (await checkItem(itemName)) {
                    break;
                } else {
                    count_errors += 1;
                };
                await sleep(5000); // Wait between item checks to avoid rate limiting
            }
            
        }
        
        const output = `${count_errors / Object.keys(searchInfo).length}\n`;
        fs.appendFileSync(fails_filepath, output, 'utf8');
        await sleepWithProgress(10000);
    }
}

async function checkItem(itemName : string) {
    try {
        await scrape(itemName).then(async results => {
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
        return true;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    }
}

// Execute the main function
start();