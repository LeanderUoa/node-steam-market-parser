export abstract class ComparisonImplementation {
    abstract compare(price: number, wear: number): boolean;
}

export class FormulaImplementation extends ComparisonImplementation {
    formulaPoint1?: {price: number, wear: number}
    formulaPoint2?: {price: number, wear: number}
    maxFloat?: number

    constructor(formulaPoint1?: {price: number, wear: number}, formulaPoint2?: {price: number, wear: number}, maxFloat?: number) {
        super();
        this.formulaPoint1 = formulaPoint1;
        this.formulaPoint2 = formulaPoint2;
        this.maxFloat = maxFloat;
    }

    compare(price: number, wear: number): boolean {
        if (this.maxFloat && this.maxFloat < wear){
            return false
        }

        if (!this.formulaPoint1 || !this.formulaPoint2) {
            throw new Error("Formula points not defined");
        }

        const p1 = this.formulaPoint1;
        const p2 = this.formulaPoint2;

        // slope = Δprice / Δwear
        const slope = (p2.price - p1.price) / (p2.wear - p1.wear);

        // expected price at this wear value
        const expectedPrice = slope * (wear - p1.wear) + p1.price;

        // true if actual price is below the line
        return price <= expectedPrice;
    }
}

export class ThresholdImplementation extends ComparisonImplementation {
    thresholds?: {priceThreshold : number, wearThreshold : number}[]
    
    
    constructor(thresholds?: {priceThreshold : number, wearThreshold : number}[]) {
        super();
        this.thresholds = thresholds;
    }

    compare(price: number, wear: number): boolean {
        if (!this.thresholds) return false;

        // true if ANY threshold pair is satisfied
        return this.thresholds.some(t =>
            price <= t.priceThreshold && wear <= t.wearThreshold
        );
    }
}
