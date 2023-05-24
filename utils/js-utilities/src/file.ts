import * as fs from 'fs'
import * as path from 'path'

export class FileUtilities {
    static list(
        dir: string,
        options?: {
            /* TODO: implement options e.g. recursive?, fullpath? */
        },
    ) {
        return this._list(dir)
    }

    private static _list(dir: string, filelist: string[] = [], relDir = '') {
        const files = fs.readdirSync(dir, { withFileTypes: true })
        for (const file of files) {
            const filepath = path.join(dir, file.name)
            const rel = `${relDir ? `${relDir}/` : ''}${file.name}`
            if (file.isDirectory()) {
                filelist = this._list(filepath, filelist, rel)
            } else {
                filelist.push(rel)
            }
        }
        return filelist
    }
}
