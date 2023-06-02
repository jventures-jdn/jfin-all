import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */
export interface LoggerReactContextType {
    logs: ReactNode[]
    setHandleMessage: Dispatch<
        SetStateAction<((type: 'add' | 'newline' | 'pop', message?: ReactNode) => void) | undefined>
    >
    addMessage: (message: string | ReactNode) => void
    addNewline: (line?: number) => void
    popMessage: () => ReactNode
    clearMessage: () => void
}

const defaultValues: LoggerReactContextType = {
    logs: [],
    setHandleMessage: () => {},
    addMessage: () => {},
    addNewline: () => {},
    popMessage: () => <></>,
    clearMessage: () => {},
}

const LoggerReactContext = createContext<LoggerReactContextType>(defaultValues)
export function useLoggerReact() {
    return useContext(LoggerReactContext)
}

/* -------------------------------------------------------------------------- */
/*                                  Provider                                  */
/* -------------------------------------------------------------------------- */
export function LoggerReactProvider({ children }: { children: ReactNode }) {
    /* --------------------------------- States --------------------------------- */
    const [logs, setLogs] = useState<ReactNode[]>([])
    const [handleMessage, setHandleMessage] =
        useState<(type: 'add' | 'newline' | 'pop', message?: ReactNode) => void>()

    /* --------------------------------- Methods -------------------------------- */
    const addMessage = (message: string | ReactNode) => {
        const isString = typeof message === 'string'
        if (!isString) setLogs([...logs, message])
        else setLogs([...logs, <div>{message}</div>])
        handleMessage && handleMessage('add', message)
    }

    const addNewline = (line = 1) => {
        setLogs([...logs, Array(line).map(() => <br />)])
        handleMessage && handleMessage('newline', <br />)
    }

    const popMessage = () => {
        const pop = logs.pop()
        setLogs([...logs])
        handleMessage && handleMessage('pop')
        return pop
    }

    const clearMessage = () => {
        setLogs([])
    }

    /* ---------------------------------- Doms ---------------------------------- */
    return (
        <>
            <LoggerReactContext.Provider
                value={{ logs, setHandleMessage, addMessage, addNewline, popMessage, clearMessage }}
            >
                {children}
            </LoggerReactContext.Provider>
        </>
    )
}
