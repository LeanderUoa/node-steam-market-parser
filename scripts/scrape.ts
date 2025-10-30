import SteamMarketParser, { Currency } from "../src/index";
import { getInspectLinks } from "../src/customUtils";   
import * as dotenv from 'dotenv';
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const smParser = new SteamMarketParser({appId: 730, currency: Currency.NZD, proxy: process.env.PROXY_URL || undefined});

async function getData(listingName : string) {
    const data = await smParser.getListing(listingName, {count: 10, start: 0});
    return data;

}

export async function scrape(listingName : string) : Promise<[number, string][]> {
    const data = await getData(listingName)

    const prices: number[] = [];
    const inspectLinks: string[] = [];

    for (const key in data.listinginfo) {
        const price = data.listinginfo[key].converted_price_per_unit + data.listinginfo[key].converted_fee_per_unit;
        prices.push(price);
    }

    getInspectLinks(data.results_html).forEach(link => {
        inspectLinks.push(link);
    });

    const mergedArray: [number, string][] = prices.map((price, index) => [price, inspectLinks[index]]);
    console.log(mergedArray)

    return mergedArray;
}