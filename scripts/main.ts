import { scrape } from './scrape';
import { compare } from './compare';
import { initSteamThen, initCsgoThen } from "./steamUser";
import { sleep, sleepWithProgress, timeout } from '../src/customUtils';
import { searchInfo } from '../src/searchInfo';
const stayAwake = require('stay-awake');

const fs = require('fs');
const path = require('path');

const fails_filepath = path.resolve(process.cwd(), 'fails_per_cycle.csv');
const time_per_cycle_filepath = path.resolve(process.cwd(), 'time_per_cycle.csv');

let cycle_number = 0;

async function start() {
    await initSteamThen(() => {initCsgoThen(main)});
}

// Main function to start the scraping process
export async function main() {
    // Ensure CSV for timing exists with a header
    if (!fs.existsSync(time_per_cycle_filepath)) {
        fs.writeFileSync(time_per_cycle_filepath, 'cycle_number,time_ms\n', 'utf8');
    }

    while (true) {
        checkSearchList();
        cycle_number += 1;
        await sleep(cycle_number > 1 ? 10000 : 100000)        
    }
}

async function checkSearchList() {
    const startTime = performance.now();
    var count_errors = 0;

    for (const itemName in searchInfo) {
        count_errors += await checkItem(itemName.trim(), searchInfo[itemName].searchOffsets ?? 1);
    }

    const output = `${(count_errors / Object.keys(searchInfo).length)},${new Date().toISOString()}\n`;
    fs.appendFileSync(fails_filepath, output, 'utf8');

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Write time for this cycle to CSV
    fs.appendFileSync(
        time_per_cycle_filepath,
        `${(duration / 1000 / Object.keys(searchInfo).length).toFixed(3)},${new Date().toISOString()}\n`,
        'utf8'
    );

    console.log(`took ${duration.toFixed(2)} ms`);
}

async function checkItem(itemName : string, noOffsets : number){
    let j = 0;
    let count_errors = 0;
    let previous_price = 0;
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
                            if (compare(link, itemName, price, goalPrice, goalFloat, previous_price / 100)) {
                                await sleep(500);
                                
                            }
                            previous_price = price;
                        }
                    }
                    j += 1;
                })(),
                timeout(cycle_number > 10 ? 10_000 : 200_000) // 10 seconds
            ]);
        } catch (error) {
            console.error('Error occurred:', error);
            count_errors += 1;
            await sleep(300); // Wait to avoid rate limiting
            continue;
        }
    }
    
    return count_errors;
}

stayAwake.prevent(function(err : any, data : any) {
    // handle error
    console.log('%d routines are preventing sleep', data);
});

// Gracefully handle exits and interrupts
const cleanup = () => {
  stayAwake.allow();
  console.log("✅ Sleep allowed again.");
  process.exit();
};

process.on("SIGINT", cleanup);  // Ctrl+C
process.on("SIGTERM", cleanup); // kill <pid>
process.on("exit", cleanup);    // normal exit
process.on("uncaughtException", cleanup); // crash safety

// Execute the main function
start();