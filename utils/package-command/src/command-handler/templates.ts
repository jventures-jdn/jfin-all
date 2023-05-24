import * as fs from 'fs'
import * as path from 'path'
import { yaml, minimatch, handlebars } from '@utils/js-utilities'

export class CommandTemplates {
    /**
     * Load command template
     */
    static load(packageType: string | 'common', targetScript: string, props: any): any {
        // Load `[packageType].yaml` template
        const templatePath = path.join(process.cwd(), `templates/${packageType}.yaml`)
        const yamlContent = fs.existsSync(templatePath) && fs.readFileSync(templatePath).toString()
        const template = yamlContent && (yaml.load(yamlContent) as any)
        const matchedTemplateKey = Object.keys(template).find(key => minimatch(targetScript, key))
        const commandTemplate = matchedTemplateKey && template[matchedTemplateKey]

        // Try fallback to `common.yaml`
        if (packageType !== 'common' && !commandTemplate)
            return this.load('common', targetScript, props)

        // Command not found
        if (!commandTemplate) return {}

        // Substitute variables in command using handlebars
        commandTemplate.command = handlebars.compile(commandTemplate.command)(props)

        // Generate env maps from template
        const envMap =
            commandTemplate.env &&
            Object.entries(commandTemplate.env).reduce((result, [envName, envValue]) => {
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
