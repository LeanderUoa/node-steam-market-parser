import * as dotenv from 'dotenv';
dotenv.config();

const ntfy_url = `https://ntfy.sh/` + (process.env.NTFY_TOPIC);
import fetch from 'node-fetch';

console.log("Sending test notification to ntfy..." + ntfy_url);
const message = "test notification from ntfy";
fetch(ntfy_url, {
    method: 'POST',
    body: message,
});