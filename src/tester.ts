import { Logger, LogLevel } from ".";

const logger = new Logger({
  filePath: './logs/app.log',
  minLogLevel: LogLevel.DEBUG,
  console: true,
  createPathDirectories: true,
  maxFileSize: 1024 * 1024 // 1 MB
});

logger.info("Information log!");
logger.error("Oops, something went wrong!");