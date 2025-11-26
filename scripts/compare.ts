const fs = require('fs');
const path = require('path');
import { log } from 'console';
import { csgo } from './steamUser';
import { ComparisonImplementation } from '../src/itemComparison';
import * as dotenv from 'dotenv';
dotenv.config();

const linksFilePath = path.resolve(process.cwd(), 'links.csv');
const notifsFilePath = path.resolve(process.cwd(), 'notifs.csv');
const ntfy_url = `https://ntfy.sh/` + (process.env.NTFY_TOPIC);

export function compare(inspectLink : string, itemName : string, price : number, implementation : ComparisonImplementation, expectedPrice: number) : boolean {
    // console.log(`Comparing item ${itemName} with link ${inspectLink} at price ${price}...`);
    // console.log(`Goal Price: ${goalPrice}, Goal Float: ${goalFloat}`);

    try {
        
        if (!fs.existsSync(linksFilePath)) {
            fs.writeFileSync(linksFilePath, inspectLink + '\n', 'utf8');
            
            return true;
        }

        const data: string = fs.readFileSync(linksFilePath, 'utf8');
        const lines = data.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
        
        // Check first column (inspect link) of each CSV line
        const matchingLine = lines.find(line => line.split(',')[0].trim() === inspectLink);

        if (matchingLine) {
            const columns = matchingLine.split(',');
            const secondColumn = parseFloat(columns[1]); // or keep as string if not numeric

            compareAndNotify(itemName, price / 100, secondColumn, implementation, expectedPrice);
            return false;
        }
        
        
        csgo.inspectItem(inspectLink, (item : any) => {inspectCallback(inspectLink, item, itemName, price / 100, implementation, expectedPrice);}); 
             
        return true;

    } catch (err) {
        throw err;
    }
}

function inspectCallback(inspectLink : string, item: any, itemName : string, price: number, implementation : ComparisonImplementation, expectedPrice: number) {
    const currentDateTime = new Date().toISOString();
    const output = `${inspectLink}, ${item.paintwear}, ${itemName}, ${price}, ${currentDateTime}\n`;
    console.log(` ${itemName} FV:${item.paintwear} at price ${price}`, );
    fs.appendFileSync(linksFilePath, output, 'utf8');

    compareAndNotify(itemName, price, item.paintwear, implementation, expectedPrice);

}

export function compareAndNotify(itemName: string, price: number, wear: number, implementation : ComparisonImplementation, expectedPrice: number) { 

    let message = `New item: ${itemName}\nPrice: $${price}\nWear: ${wear}`;

    if (Number.isNaN(price)) {
        if (Number.isNaN(expectedPrice)){
            console.log("no valid neighbours found...")
        } else if (!implementation.compare(expectedPrice * 0.95, wear)) {
            return;
        }
        message = `Missed Item: ${itemName}\nWear: ${wear}\nEst. price: \$${expectedPrice != 0 ? expectedPrice : "N/A"} `;
    } else {
        if (!implementation.compare(price, wear)) {
            return;
        }
    }

    notifyAndWrite(itemName, price, wear, message);
}

function notifyAndWrite(itemName: string, price: number, wear: number, message: string){
    console.log(message);

    const data: string = fs.readFileSync(notifsFilePath, 'utf8');
    const lines = data.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);

    if (!lines.find(line => line.split(',')[0].trim() === itemName && line.split(',')[1].trim() === price.toString() && line.split(',')[2].trim() === wear.toString())){
        // notification is new
        const csvRow = `${itemName}, ${price}, ${wear}\n`;
        fs.appendFileSync(notifsFilePath, csvRow, 'utf8');

        fetch(ntfy_url, {
            method: 'POST',
            body: message,
        });
    } else {
        console.log("Notification already sent for this item at this price and wear.");
    }
}