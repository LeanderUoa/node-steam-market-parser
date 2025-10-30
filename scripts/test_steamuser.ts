const SteamUser = require('steam-user');
const GlobalOffensive = require('globaloffensive');

let user = new SteamUser();
let csgo = new GlobalOffensive(user);

