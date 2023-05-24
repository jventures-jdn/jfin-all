export class NumberUtilities {
    static isComparisionOperator(operator: string) {
        return ['==', '>=', '<=', '>', '<'].includes(operator)
    }
}
