const SteamUser = require('steam-user');
import { main } from './main';
import * as dotenv from 'dotenv';
dotenv.config();
const readlineSync = require('readline-sync');
const GlobalOffensive = require('globaloffensive');

console.log(process.env.STEAM_PROXY_URL)
export const client = new SteamUser({
    httpProxy: process.env.STEAM_PROXY_URL || undefined,
});



export var csgo = new GlobalOffensive(client);

const details = {
    user: process.env.STEAM_USER || '',
    pass: process.env.STEAM_PASS || '',
    anonymous: false
}

function getCode() : string {
    try {
        const input: string = readlineSync.question('Enter Steam Guard code: ');
        return input.trim().toUpperCase();
    } catch (err) {
        // Fallback: return env var or empty string if readline-sync isn't available
        return process.env.STEAM_GUARD_CODE || '';
    }
}

export function initSteamThen(func : Function) {

    client.logOn({ accountName: details.user, password: details.pass});

    // Event listener for successful login
    client.on('loggedOn', () => {
        console.log('Logged into Steam successfully!');
        func()
        // You can now perform other actions like setting games played, etc.
    });

}

export function initCsgoThen(func : Function) {
    client.gamesPlayed([730])

    csgo.on('connectedToGC', () => {
        console.log("Connected to CSGO Game Coordinator");
        func() // Call the provided function after successful connection
    });
}
