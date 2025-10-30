const fs = require('fs');
const path = require('path');
import { searchInfo } from './main';
import { csgo } from './steamUser';
const filePath = path.resolve(process.cwd(), 'links.csv');



export function compare(inspectLink : string, itemName : string, price : number){


    try {
        
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, inspectLink + '\n', 'utf8');
            
            return true;
        }

        const data: string = fs.readFileSync(filePath, 'utf8');
        const lines = data.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
        
        // Check first column (inspect link) of each CSV line
        if (lines.some(line => line.split(',')[0].trim() === inspectLink)) {
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
    fs.appendFileSync(filePath, output, 'utf8');

    if (searchInfo[itemName].priceThreshold >= price && searchInfo[itemName].wearThreshold >= item.paintwear) {
        console.log(`Item ${itemName} meets the criteria: Price - ${price}, Paintwear - ${item.paintwear}`); 
    }

}