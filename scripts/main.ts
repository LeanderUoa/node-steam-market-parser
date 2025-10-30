import { scrape } from './scrape';
import { compare } from './compare';
import { initSteamThen, initCsgoThen } from "./steamUser";
import { sleep } from '../src/customUtils';


async function start() {
    await initSteamThen(() => {initCsgoThen(main)});
}

export const searchInfo: { [key: string]: { priceThreshold: number; wearThreshold: number } } = {
    "Glock-18 | Snack Attack (Minimal Wear)": {
        priceThreshold: 60,
        wearThreshold: 0.13
    },
    "MAC-10 | Toybox (Minimal Wear)": {
        priceThreshold: 55,
        wearThreshold: 0.115
    }
};

// Main function to start the scraping process
export async function main() {
    while (true) {
        for (const itemName in searchInfo) {
            await checkItem(itemName);
            await sleep(5000); // Wait between item checks to avoid rate limiting
        }    
        await sleep(120000);
    }
}

async function checkItem(itemName : string) {
    try {
        await scrape(itemName).then(async results => {
            for (let i = 0; i < results.length; i++) {
                await sleep(1000);
                const [price, link] = results[i];
                if (compare(link, itemName, price)) {
                    console.log(`New link added: ${link} at price ${price}`);                    
                } else {
                    console.log(`Duplicate link found, skipping: ${link}`);                    
                }
                
            }
        });
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Execute the main function
start();