

import { initSteamThen } from "./steamUser";
const GlobalOffensive = require('globaloffensive');
import { client as user } from './steamUser';

let csgo = new GlobalOffensive(user);

initSteamThen(() => {
    user.gamesPlayed([730])

    csgo.on('connectedToGC', () => {
        console.log("Connected to CSGO Game Coordinator");
        csgo.inspectItem("steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M659340121531214656A33317455223D9558410868262448729", inspectCallback);
    });
});


function inspectCallback(item: any){
    console.log("Item inspected:", item);
}