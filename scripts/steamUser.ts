import steamBot from "./steamBot";

const details = {
    user: process.env.STEAM_USER || '',
    pass: process.env.STEAM_PASS || ''
}

export const steamUser = new steamBot();