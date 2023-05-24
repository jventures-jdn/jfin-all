import * as _ from 'lodash'

export class Utilities {
    /** Generate array of all property paths (dots format) of an object e.g. [`obj.some.path.key`] */
    static getPaths(object: any) {
        const leaves: string[] = []
        const walk = function (obj: any, path?: string) {
            for (const n in obj) {
                const newPath = path ? `${path}.${n}` : n
                if (_.isObjectLike(obj[n])) {
                    walk(obj[n], newPath)
                } else {
                    leaves.push(newPath)
                }
            }
        }
        walk(object)
        return leaves
    }

    /** Set values to object from the given path-value map */
    static setPaths(to: any, replace: { path: string; value: string }[]) {
        replace.forEach(({ path, value }) => {
            _.set(to, path, value)
        })
        return to
    }
}
