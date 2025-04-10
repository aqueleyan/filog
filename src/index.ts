import { promises as fs } from 'fs'
import * as path from 'path'

export enum LogLevel {
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  CRITICAL = 50,
}

export interface LoggerOptions {
  logName?: string
  filePath: string
  minLogLevel?: LogLevel
  console?: boolean
  createPathDirectories?: boolean
  maxFileSize?: number
  errorFilePath?: string
  criticalFilePath?: string
  showEntriesPrefix?: boolean
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mn = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${dd}-${mm}-${yyyy} - ${hh}:${mn}:${ss}`
}

function getSystemTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export class Logger {
  private logName: string
  private filePath: string
  private minLogLevel: LogLevel
  private writeToConsole: boolean
  private createDirs: boolean
  private maxFileSize?: number
  private errorFilePath: string
  private criticalFilePath: string
  private showEntriesPrefix: boolean
  private queue: { level: LogLevel; entry: string }[] = []
  private isWriting = false
  private mainFileReady = false
  private errorFileReady = false
  private criticalFileReady = false

  constructor(options: LoggerOptions) {
    this.filePath = options.filePath
    this.logName = options.logName ?? this.filePath
    this.minLogLevel = options.minLogLevel ?? LogLevel.DEBUG
    this.writeToConsole = options.console ?? true
    this.createDirs = options.createPathDirectories ?? true
    this.maxFileSize = options.maxFileSize
    this.showEntriesPrefix = options.showEntriesPrefix ?? false
    this.errorFilePath = options.errorFilePath
      ? options.errorFilePath
      : this.filePath.replace(/(\.\w+)?$/, '.error.log')
    this.criticalFilePath = options.criticalFilePath
      ? options.criticalFilePath
      : this.filePath.replace(/(\.\w+)?$/, '.critical.log')
    if (this.createDirs) {
      fs.mkdir(path.dirname(this.filePath), { recursive: true }).catch(() => {})
      fs.mkdir(path.dirname(this.errorFilePath), { recursive: true }).catch(() => {})
      fs.mkdir(path.dirname(this.criticalFilePath), { recursive: true }).catch(() => {})
    }

    void this.initializeMainFile()
  }

  private async initializeMainFile(): Promise<void> {
    try {
      await fs.stat(this.filePath)
      if (this.showEntriesPrefix) {
        const tz = getSystemTimeZone()
        const prefix = `\n--- NEW LOGGER SESSION: ${this.logName} on [${tz}] started at [${formatDate(new Date())}] ---\n`
        await fs.appendFile(this.filePath, prefix, 'utf8')
      }
    } catch {
      const tz = getSystemTimeZone()
      const header = `REAL TIME AUDIT: ${this.logName}\nDate set in the format [DD-MM-YYYY - HH:MM:SS] in [${tz}]\n`
      await fs.writeFile(this.filePath, header, 'utf8')
    } finally {
      this.mainFileReady = true
    }
  }

  private async initializeFileIfNeeded(filePath: string, isReadyFlag: 'errorFileReady' | 'criticalFileReady') {
    if (this[isReadyFlag]) return
    try {
      await fs.stat(filePath)
      if (this.showEntriesPrefix) {
        const tz = getSystemTimeZone()
        const prefix = `\n--- NEW LOGGER SESSION: ${this.logName} on [${tz}] started at [${formatDate(new Date())}] ---\n`
        await fs.appendFile(filePath, prefix, 'utf8')
      }
    } catch {
      const tz = getSystemTimeZone()
      const header = `REAL TIME AUDIT: ${this.logName}\nDate set in the format [DD-MM-YYYY - HH:MM:SS] in [${tz}]\n`
      await fs.writeFile(filePath, header, 'utf8')
    } finally {
      this[isReadyFlag] = true
    }
  }

  public async log(level: LogLevel, message: string): Promise<void> {
    if (level < this.minLogLevel) return
    const prefix = `[${formatDate(new Date())}] [${LogLevel[level]}]`
    const entry = `${prefix}: ${message}\n`
    if (this.writeToConsole) {
      if (level === LogLevel.CRITICAL) {
        console.log('\x1b[41m%s\x1b[0m', entry.trim())
      } else {
        console.log(entry.trim())
      }
    }
    this.queue.push({ level, entry })
    void this.processQueue()
  }

  private async processQueue(): Promise<void> {
    if (this.isWriting) return
    this.isWriting = true
    try {
      while (this.queue.length) {
        const { level, entry } = this.queue.shift()!

        while (!this.mainFileReady) {
          await new Promise((r) => setTimeout(r, 25))
        }
        await fs.appendFile(this.filePath, entry, 'utf8')

        if (level >= LogLevel.ERROR) {
          await this.initializeFileIfNeeded(this.errorFilePath, 'errorFileReady')
          await fs.appendFile(this.errorFilePath, entry, 'utf8')
        }
        if (level === LogLevel.CRITICAL) {
          await this.initializeFileIfNeeded(this.criticalFilePath, 'criticalFileReady')
          await fs.appendFile(this.criticalFilePath, entry, 'utf8')
        }

        if (this.maxFileSize) {
          await this.checkRotation(this.filePath)
          if (level >= LogLevel.ERROR) await this.checkRotation(this.errorFilePath)
          if (level === LogLevel.CRITICAL) await this.checkRotation(this.criticalFilePath)
        }
      }
    } finally {
      this.isWriting = false
      if (this.queue.length > 0) {
        void this.processQueue()
      }
    }
  }

  private async checkRotation(file: string): Promise<void> {
    try {
      const stats = await fs.stat(file)
      if (stats.size > (this.maxFileSize ?? Infinity)) {
        const ts = new Date().toISOString().replace(/[:.]/g, '-')
        await fs.rename(file, `${file}.${ts}.old`)
      }
    } catch {}
  }

  public async debug(msg: string) {
    return this.log(LogLevel.DEBUG, msg)
  }

  public async info(msg: string) {
    return this.log(LogLevel.INFO, msg)
  }

  public async warn(msg: string) {
    return this.log(LogLevel.WARN, msg)
  }

  public async error(msg: string) {
    return this.log(LogLevel.ERROR, msg)
  }

  public async critical(msg: string) {
    return this.log(LogLevel.CRITICAL, msg)
  }
}
