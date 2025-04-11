import { Logger, LogLevel } from "./Logger";

const logger = new Logger({
  filePath: './logs/app.log',
  minLogLevel: LogLevel.DEBUG,
  console: true,
  createPathDirectories: true,
  maxFileSize: 1024 * 1024, // 1 MB
  showEntriesPrefix: true,
});

logger.info("Information log!");
logger.error("Oops, something went wrong!");

if (1 < 2) {
  logger.critical("HELP: Math exists here!")
}