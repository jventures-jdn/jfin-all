import * as fs from 'fs'
import * as path from 'path'
import { yaml, minimatch, handlebars } from '@utils/js-utilities'

type Instruction = {
    commandTemplate: {
        command: string
        defaultArgs?: string
        globalConfig?: 'dev' | 'docker' | 'deploy'
    }
    envMap: Record<string, string>
    fullEnvString: string
}

export class CommandTemplates {
    /**
     * Load command template
     */
    static load(packageType: string, targetScript: string, props: any): Instruction[] | null {
        // Load `[packageType].yaml` template
        const templatePath = path.join(process.cwd(), `templates/${packageType}.yaml`)
        const yamlContent = fs.existsSync(templatePath) && fs.readFileSync(templatePath).toString()
        const template = yamlContent && (yaml.load(yamlContent) as any)

        const matchedTemplateKey = Object.keys(template).find(key => minimatch(targetScript, key))
        let instructions = matchedTemplateKey && template[matchedTemplateKey]

        if (!instructions) {
            // Try fallback to `common.yaml` template
            if (packageType !== 'common') return this.load('common', targetScript, props)
            else return null
        }

        // support invidual or array
        if (!Array.isArray(instructions)) instructions = [instructions]
        const result: Instruction[] = []
        instructions.forEach((instruction: any) => {
            result.push(this.parse(instruction, packageType, targetScript, props))
        })
        return result
    }

    private static parse(
        instruction: any,
        packageType: string | 'common',
        targetScript: string,
        props: any,
    ): Instruction {
        // Command not found
        if (!instruction.command) {
            console.warn(`'${targetScript}' command for '${packageType}' is empty`)
        }

        // Substitute variables in command using handlebars
        const commandTemplate: Instruction['commandTemplate'] = {
            command: handlebars.compile(instruction.command)(props),
        }

        if (instruction.defaultArgs)
            commandTemplate.defaultArgs = handlebars.compile(instruction.defaultArgs)(props)
        if (instruction.globalConfig)
            commandTemplate.globalConfig = handlebars.compile(instruction.globalConfig)(
                props,
            ) as any

        // Generate env maps from template
        const envMap =
            instruction.env &&
            Object.entries(instruction.env).reduce((result, [envName, envValue]) => {
                return {
                    ...result,
                    // Substitute variables in env value using handlebars
                    [envName]: handlebars.compile(envValue)(props),
                }
            }, {})

        // Generate final env string to put in front of the actual command
        const fullEnvString =
            envMap &&
            Object.entries(envMap)
                .filter(([, value]) => !!value)
                .map(([key, value]) => `${key}=${value}`)
                .join(' ')

        return { commandTemplate, envMap, fullEnvString }
    }
}
