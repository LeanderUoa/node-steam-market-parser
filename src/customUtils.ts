export function getInspectLinks(htmlString: string) : string[] {


    const html = htmlString || "";
    const linkRegex = /href="(steam:\/\/rungame\/[^"]+)"/g;
    const links: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(html)) !== null) {
        links.push(match[1]);
    }

    if (links.length === 0) {
        console.log("No Steam game links found");
        return [];
    } else {
        return links
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sleepWithProgress(ms: number): Promise<void> {
    const totalSteps = ms / 100; // Assuming progress updates every 100ms
    for (let i = 0; i < totalSteps; i++) {
        await sleep(100);
        const progress = Math.round(((i + 1) / totalSteps) * 100);
        process.stdout.write(`\rWaiting: ${progress}%`);
    }
    console.log(); // Move to the next line after completion
}

export function timeout(ms: number, message = 'Operation timed out'): Promise<never> {
    return new Promise((_, reject) => {
        const error = new Error(`${message} (${ms}ms)`);
        const timer = setTimeout(() => reject(error), ms);
        
    });
}