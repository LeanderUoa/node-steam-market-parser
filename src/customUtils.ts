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
