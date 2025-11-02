const fs = require('fs');
const path = require('path');
import { log } from 'console';
import { searchInfo } from './main';
import { csgo } from './steamUser';
import * as dotenv from 'dotenv';
dotenv.config();

const filePath = path.resolve(process.cwd(), 'links.csv');
const ntfy_url = `https://ntfy.sh/` + (process.env.NTFY_TOPIC);

export function compare(inspectLink : string, itemName : string, price : number){


    try {
        
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, inspectLink + '\n', 'utf8');
            
            return true;
        }

        const data: string = fs.readFileSync(filePath, 'utf8');
        const lines = data.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
        
        // Check first column (inspect link) of each CSV line
        const matchingLine = lines.find(line => line.split(',')[0].trim() === inspectLink);

        if (matchingLine) {
            const columns = matchingLine.split(',');
            const secondColumn = parseFloat(columns[1]); // or keep as string if not numeric

            compareAndNotify(itemName, price / 100, secondColumn);
            return false;
        }
        
        
        csgo.inspectItem(inspectLink, (item : any) => {inspectCallback(inspectLink, item, itemName, price / 100)}); 
             
        return true;

    } catch (err) {
        throw err;
    }
}

function inspectCallback(inspectLink : string, item: any, itemName : string, price: number) {
    const currentDateTime = new Date().toISOString();
    const output = `${inspectLink}, ${item.paintwear}, ${itemName}, ${price}, ${currentDateTime}\n`;
    console.log(` ${itemName} FV:${item.paintwear} at price ${price}`, );  
    fs.appendFileSync(filePath, output, 'utf8');

    compareAndNotify(itemName, price, item.paintwear);

}

function compareAndNotify(itemName: string, price: number, wear: number) {
    if (searchInfo[itemName].priceThreshold >= price && searchInfo[itemName].wearThreshold >= wear) {
        const message = `Item: ${itemName}\nPrice: $${price}\nWear: ${wear}`;
        console.log(`Item ${itemName} meets the criteria: Price - ${price}, Paintwear - ${wear}`); 

        fetch(ntfy_url, {
            method: 'POST',
            body: message,
        });

    } else if (searchInfo[itemName].wearThreshold >= wear && Number.isNaN(price)) {
        const message = `Missed Item: ${itemName}\nPrice: N/A\nWear: ${wear}`;
        console.log(message);
        fetch(ntfy_url, {
            method: 'POST',
            body: message,
        });
    }
}