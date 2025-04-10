import { promises as fs, createWriteStream, WriteStream } from 'fs'
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

function writeToStream(stream: WriteStream, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const canWrite = stream.write(data, 'utf8')
    if (!canWrite) {
      stream.once('drain', resolve)
    } else {
      process.nextTick(resolve)
    }
  })
}

async function initializeStream(file: string, logName: string, showPrefix: boolean): Promise<WriteStream> {
  try {
    await fs.stat(file)
    if (showPrefix) {
      const tz = getSystemTimeZone()
      const prefix = `\n--- NEW LOGGER SESSION: ${logName} on [${tz}] started at [${formatDate(new Date())}] ---\n`
      await fs.appendFile(file, prefix, 'utf8')
    }
  } catch {
    const tz = getSystemTimeZone()
    const header = `REAL TIME AUDIT: ${logName}\nDate set in the format [DD-MM-YYYY - HH:MM:SS] in [${tz}]\n`
    await fs.writeFile(file, header, 'utf8')
  }
  return createWriteStream(file, { flags: 'a' })
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
  private isProcessing = false
  private mainStreamPromise: Promise<WriteStream>
  private errorStreamPromise: Promise<WriteStream> | null = null
  private criticalStreamPromise: Promise<WriteStream> | null = null

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
    this.mainStreamPromise = initializeStream(this.filePath, this.logName, this.showEntriesPrefix)
  }

  private async getErrorStream(): Promise<WriteStream> {
    if (!this.errorStreamPromise) {
      this.errorStreamPromise = initializeStream(this.errorFilePath, this.logName, this.showEntriesPrefix)
    }
    return this.errorStreamPromise
  }

  private async getCriticalStream(): Promise<WriteStream> {
    if (!this.criticalStreamPromise) {
      this.criticalStreamPromise = initializeStream(this.criticalFilePath, this.logName, this.showEntriesPrefix)
    }
    return this.criticalStreamPromise
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
    this.processQueue().catch(() => {})
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return
    this.isProcessing = true
    try {
      while (this.queue.length) {
        const { level, entry } = this.queue.shift()!
        const mainStream = await this.mainStreamPromise
        await writeToStream(mainStream, entry)
        if (this.maxFileSize) await this.rotateIfNeeded(this.filePath, mainStream)
        if (level >= LogLevel.ERROR) {
          const errorStream = await this.getErrorStream()
          await writeToStream(errorStream, entry)
          if (this.maxFileSize) await this.rotateIfNeeded(this.errorFilePath, errorStream)
        }
        if (level === LogLevel.CRITICAL) {
          const criticalStream = await this.getCriticalStream()
          await writeToStream(criticalStream, entry)
          if (this.maxFileSize) await this.rotateIfNeeded(this.criticalFilePath, criticalStream)
        }
      }
    } finally {
      this.isProcessing = false
      if (this.queue.length > 0) this.processQueue().catch(() => {})
    }
  }

  private async rotateIfNeeded(file: string, stream: WriteStream): Promise<void> {
    try {
      const stats = await fs.stat(file)
      if (stats.size > (this.maxFileSize ?? Infinity)) {
        await new Promise(resolve => stream.end(resolve))
        const ts = new Date().toISOString().replace(/[:.]/g, '-')
        await fs.rename(file, `${file}.${ts}.old`)
        if (file === this.filePath) {
          this.mainStreamPromise = initializeStream(this.filePath, this.logName, this.showEntriesPrefix)
        } else if (file === this.errorFilePath) {
          this.errorStreamPromise = initializeStream(this.errorFilePath, this.logName, this.showEntriesPrefix)
        } else if (file === this.criticalFilePath) {
          this.criticalStreamPromise = initializeStream(this.criticalFilePath, this.logName, this.showEntriesPrefix)
        }
      }
    } catch {}
  }

  public async debug(msg: string): Promise<void> {
    return this.log(LogLevel.DEBUG, msg)
  }

  public async info(msg: string): Promise<void> {
    return this.log(LogLevel.INFO, msg)
  }

  public async warn(msg: string): Promise<void> {
    return this.log(LogLevel.WARN, msg)
  }

  public async error(msg: string): Promise<void> {
    return this.log(LogLevel.ERROR, msg)
  }

  public async critical(msg: string): Promise<void> {
    return this.log(LogLevel.CRITICAL, msg)
  }
}
