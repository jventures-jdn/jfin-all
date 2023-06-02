import { CommonComponentProps } from '@utils/app-nextjs'
import { useLoggerReact } from '../provider/LoggerReactProvider'

export function LoggerReact(
    props: CommonComponentProps & { loading?: boolean; title?: string; user?: string },
) {
    /* --------------------------------- States --------------------------------- */
    const { logs } = useLoggerReact()

    /* ---------------------------------- Doms ---------------------------------- */
    const LoggerReactHead = () => (
        <div className="logger-react-head relative flex items-center bg-base-100 h-[50px] border-b border-base-300 p-5">
            <div className="flex gap-2">
                <div className="p-[7px] bg-red-400 w-0 h-0 rounded-full" />
                <div className="p-[7px] bg-yellow-400 w-0 h-0 rounded-full" />
                <div className="p-[7px] bg-green-400 w-0 h-0 rounded-full" />
            </div>
            <div className="absolute left-0 right-0 text-center">{props.title || 'Logger'}</div>
        </div>
    )

    const LoggerReactBody = () => (
        <div className="logger-react-body p-5 text-sm">
            {logs.map((log, index) => (
                <div key={index}>{log}</div>
            ))}
            <div>
                <span className="text-gray-400">
                    {props.user || '$'} {'>'}
                </span>{' '}
                <span className="animate-pulse">|</span>
            </div>
        </div>
    )

    return (
        <div
            className={`logger-react w-full h-full bg-gradient-to-br from-base-100  to-base-200 rounded-lg  overflow-y-auto ${
                props.className || ''
            }`}
            id={props.id}
            style={props.style}
            key={props.key}
        >
            <LoggerReactHead />
            <LoggerReactBody />
        </div>
    )
}
