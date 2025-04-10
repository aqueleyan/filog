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
  private filePath: string
  private minLogLevel: LogLevel
  private writeToConsole: boolean
  private createDirs: boolean
  private maxFileSize?: number
  private errorFilePath: string
  private criticalFilePath: string
  private queue: { level: LogLevel; entry: string }[] = []
  private isWriting = false

  constructor(options: LoggerOptions) {
    this.filePath = options.filePath
    this.minLogLevel = options.minLogLevel ?? LogLevel.DEBUG
    this.writeToConsole = options.console ?? true
    this.createDirs = options.createPathDirectories ?? true
    this.maxFileSize = options.maxFileSize
    this.errorFilePath = options.errorFilePath
      ? options.errorFilePath
      : this.filePath.replace(/(\.\w+)?$/, '.error.log')
    this.criticalFilePath = options.criticalFilePath
      ? options.criticalFilePath
      : this.filePath.replace(/(\.\w+)?$/, '.critical.log')

    if (this.createDirs) {
      const baseDir = path.dirname(this.filePath)
      fs.mkdir(baseDir, { recursive: true }).catch(() => {})
      fs.mkdir(path.dirname(this.errorFilePath), { recursive: true }).catch(() => {})
      fs.mkdir(path.dirname(this.criticalFilePath), { recursive: true }).catch(() => {})
    }
  }

  public async log(level: LogLevel, message: string): Promise<void> {
    if (level < this.minLogLevel) return
    const timeStamp = formatDate(new Date());
    const prefix = `[${timeStamp}] [${LogLevel[level]}]`
    const entry = `${prefix}: ${message}\n`
    if (this.writeToConsole) {
      if (level === LogLevel.CRITICAL) {
        console.log('\x1b[41m' + entry.trim() + '\x1b[0m')
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
      while (this.queue.length > 0) {
        const { level, entry } = this.queue.shift()!
        await fs.appendFile(this.filePath, entry, 'utf8')
        if (level >= LogLevel.ERROR) {
          await fs.appendFile(this.errorFilePath, entry, 'utf8')
        }
        if (level === LogLevel.CRITICAL) {
          await fs.appendFile(this.criticalFilePath, entry, 'utf8')
        }
        if (this.maxFileSize) {
          await this.checkRotation(this.filePath)
          await this.checkRotation(this.errorFilePath)
          await this.checkRotation(this.criticalFilePath)
        }
      }
    } finally {
      this.isWriting = false
      if (this.queue.length > 0) {
        void this.processQueue()
      }
    }
  }

  private async checkRotation(pathToCheck: string): Promise<void> {
    try {
      const stats = await fs.stat(pathToCheck)
      if (stats.size > this.maxFileSize!) {
        const timeStamp = new Date().toISOString().replace(/[:.]/g, '-')
        await fs.rename(pathToCheck, pathToCheck + '.' + timeStamp + '.old')
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
