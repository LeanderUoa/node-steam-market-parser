import { scrape } from './scrape';
import { compare } from './compare';

// Main function to start the scraping process
async function main() {
    try {
        await scrape('Five-SeveN | Hyper Beast (Field-Tested)').then(results => {
            results.forEach(([price, link]) => {
                if (compare(link)) {
                    console.log(`New link added: ${link} at price ${price}`);                    
                } else {
                    console.log(`Duplicate link found, skipping: ${link}`);                    
                }
            })
        });
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Execute the main function
main();