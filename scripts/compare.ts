const fs = require('fs');
const path = require('path');

const SteamUser = require('steam-user');
const GlobalOffensive = require('globaloffensive');

let user = new SteamUser();
let csgo = new GlobalOffensive(user);

export function compare(inspectLink : string){
    const filePath = path.resolve(process.cwd(), 'links.csv');

    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, inspectLink + '\n', 'utf8');
            return true;
        }

        const data: string = fs.readFileSync(filePath, 'utf8');
        const lines = data.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);

        if (lines.includes(inspectLink)) {
            return false;
        }

        // inspect the item

        // ensure previous line ends with newline
        const toAppend = (data.length === 0 || data.endsWith('\n')) ? inspectLink + '\n' : '\n' + inspectLink + '\n';
        fs.appendFileSync(filePath, toAppend, 'utf8');
        return true;
    } catch (err) {
        throw err;
    }
}