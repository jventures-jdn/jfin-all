// https://stackoverflow.com/questions/51555568/remove-logging-the-origin-line-in-jest
import { CustomConsole, LogType, LogMessage } from '@jest/console'

function simpleFormatter(type: LogType, message: LogMessage): string {
    const TITLE_INDENT = '   '
    const CONSOLE_INDENT = TITLE_INDENT
    return message
        .split(/\n/)
        .map(line => CONSOLE_INDENT + line)
        .join('\n')
}

if (!process.env.npm_lifecycle_script?.includes('--silent'))
    global.console = new CustomConsole(process.stdout, process.stderr, simpleFormatter)
