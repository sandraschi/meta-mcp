export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

export interface LogEntry {
    timestamp: number
    level: LogLevel
    message: string
    context?: any
}

type LogListener = (entry: LogEntry) => void

class Logger {
    private logs: LogEntry[] = []
    private maxLogs: number = 1000
    private listeners: LogListener[] = []

    constructor() { }

    private addLog(level: LogLevel, message: string, context?: any) {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            message,
            context
        }

        this.logs.push(entry)
        if (this.logs.length > this.maxLogs) {
            this.logs.shift()
        }

        // Notify listeners
        this.listeners.forEach(listener => listener(entry))

        // Also log to console for devtools
        const style = this.getConsoleStyle(level)
        console.log(`%c[${level}] ${message}`, style, context || '')
    }

    info(message: string, context?: any) {
        this.addLog(LogLevel.INFO, message, context)
    }

    warn(message: string, context?: any) {
        this.addLog(LogLevel.WARN, message, context)
    }

    error(message: string, context?: any) {
        this.addLog(LogLevel.ERROR, message, context)
    }

    debug(message: string, context?: any) {
        this.addLog(LogLevel.DEBUG, message, context)
    }

    getLogs(): LogEntry[] {
        return [...this.logs]
    }

    clear() {
        this.logs = []
        // We could emit a clear event here if needed, but for now we just clear internal state
    }

    on(event: 'log', listener: LogListener) {
        if (event === 'log') {
            this.listeners.push(listener)
        }
    }

    off(event: 'log', listener: LogListener) {
        if (event === 'log') {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    private getConsoleStyle(level: LogLevel): string {
        switch (level) {
            case LogLevel.INFO: return 'color: #3b82f6; font-weight: bold'
            case LogLevel.WARN: return 'color: #eab308; font-weight: bold'
            case LogLevel.ERROR: return 'color: #ef4444; font-weight: bold'
            case LogLevel.DEBUG: return 'color: #a855f7; font-weight: bold'
            default: return 'color: #94a3b8'
        }
    }
}

export const logger = new Logger()
