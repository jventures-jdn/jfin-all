export class ArrayUtilities {
    /**
     * Produce cartesian product (combinations) of arrays
     *
     * Example:
     * cartesian([1, 2], [10, 20], [100, 200, 300])
     * Output >
     * [
     *   [1, 10, 100],
     *   [1, 10, 200],
     *   [1, 10, 300],
     *   [2, 10, 100],
     *   [2, 10, 200]
     *   ...
     * ]
     */
    static cartesian(a: any[][]) {
        return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
    }

    /**
     * Merge array of objects into a single object
     */
    static mergeObjects(objectsArray: object[]) {
        return Object.assign({}, ...objectsArray)
    }
}
