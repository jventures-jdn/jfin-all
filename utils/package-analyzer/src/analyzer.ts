import * as fs from 'fs'
import * as path from 'path'
import { yaml } from '@utils/js-utilities'

export class PackageAnalyzer {
    /**
     * Load and Analyze `package.json` from the given package name or path
     * @param packageNameOrPath e.g. `apps/app-name` or `@utils/lib-name`
     */
    static analyze(packageNameOrPath: string) {
        const { raw, info } = this.load(packageNameOrPath)
        const appType = this.deriveAppType(raw)
        return {
            json: raw,
            type: appType,
            props: {
                port: raw.port,
                dockerFile: raw.dockerFile || appType,
                type: appType,
                ...info,
            },
        }
    }

    /**
     * Load raw `package.json` from the given package path into object
     * @param packagePath e.g. `apps/app-name`
     */
    static load(packagePath: string) {
        const packageInfo = this.getPackageInfo(packagePath)
        if (!packageInfo) {
            throw Error(`⛔ Package nor found: ${packagePath}`)
        }

        const packageJsonPath = path.join(packageInfo.fullPath, `package.json`)
        if (!fs.existsSync(packageJsonPath)) {
            throw Error(`⛔ package.json not found for \`${packageInfo.folder}\``)
        }

        return {
            raw: JSON.parse(fs.readFileSync(packageJsonPath).toString()),
            info: packageInfo,
        }
    }

    /**
     * Predict app type of the given package.json by looking at their installed npm dependencies
     * @param packageJson loaded package.json object
     * @returns type of app e.g. nestjs, nextjs, etc. `undefined` if can't be derived
     */
    static deriveAppType(packageJson: any) {
        if (packageJson.devDependencies?.['@nestjs/cli']) return 'nestjs'
        else if (packageJson.dependencies?.['hardhat'] && packageJson.dependencies?.['next']) return 'nextjs-hardhat'
        else if (packageJson.dependencies?.['next']) return 'nextjs'
        else if (packageJson.dependencies?.['@docusaurus/core']) return 'docusaurus'
        else if (packageJson.devDependencies?.['react-styleguidist']) return 'styleguidist'
        else return 'lib'
    }

    // ------- Internal Helpers -------

    // Get package info from the given package path e.g. `apps/app-name`
    private static getPackageInfo(packagePath: string) {
        const [root, dir] = packagePath.split('/')
        return {
            fullName: `${root}.${dir}`,
            escapeName: `${root}-${dir}`,
            shortName: dir,
            packageName: `@${root}/${dir}`,
            folder: `${root}/${dir}`,
            fullPath: path.join(process.cwd(), `../../${root}/${dir}`),
        }
    }

    // List all packages
    private static listPackageInfo(rootDirs = this.pnpmRootDirs()) {
        const lookupSubDir = (root: string) => {
            const rootDirPath = path.join(process.cwd(), `../../${root}`)
            if (fs.existsSync(rootDirPath))
                return fs
                    .readdirSync(rootDirPath, {
                        withFileTypes: true,
                    })
                    .filter(d => d.isDirectory())
                    .map(d => this.getPackageInfo(`${root}/${d.name}`))
            else return []
        }
        return rootDirs.flatMap(dir => lookupSubDir(dir))
    }

    // Get packages root dirs from `pnpm-workspace.yaml`
    private static pnpmRootDirs() {
        const pnpmWorkspaceYaml = fs
            .readFileSync(path.join(process.cwd(), `../../pnpm-workspace.yaml`))
            .toString()
        const pnpmWorkspace = yaml.load(pnpmWorkspaceYaml) as any
        const packages = pnpmWorkspace.packages as string[]
        return packages.map(p => p.split('/')[0]) // remove '/*'
    }
}
