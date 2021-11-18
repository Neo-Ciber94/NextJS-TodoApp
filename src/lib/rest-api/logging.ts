import chalk from "chalk";

export enum LogLevel {
  TRACE = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

let DEFAULT_LOGGER: Logger | null = null;

export class Logger {
  static get default(): Logger {
    if (DEFAULT_LOGGER == null) {
      DEFAULT_LOGGER = new Logger();
    }

    return DEFAULT_LOGGER;
  }

  info(message: string) {
    this.log(LogLevel.TRACE, message);
  }

  success(message: string) {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  error(message: string) {
    this.log(LogLevel.ERROR, message);
  }

  log(level: LogLevel, message: string) {
    const levelName: string = LogLevel[level];
    const time = chalk.cyan(new Date().toISOString());

    switch (level) {
      case LogLevel.TRACE:
        message = chalk.blueBright(`[${levelName}] ${message}`);
        break;
      case LogLevel.INFO:
        message = chalk.green(`[${levelName}] ${message}`);
        break;
      case LogLevel.WARN:
        message = chalk.yellow(`[${levelName}] ${message}`);
        break;
      case LogLevel.ERROR:
        message = chalk.red(`[${levelName}] ${message}`);
        break;
    }

    console.log(`${time} ${message}`);
  }
}
