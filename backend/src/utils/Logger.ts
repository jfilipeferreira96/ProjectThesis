import chalk from "chalk";

class Logger
{
  static dateFormat: string;

  static getCurrentTime(): string
  {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  static info(message: string)
  {
    const currentTime = this.getCurrentTime();
    console.log(`${chalk.bold.yellow("[INFO]")} ${chalk.bold(`${currentTime}:`)} ${message}`);
  }

  static error(message: string)
  {
    const currentTime = this.getCurrentTime();
    console.log(`${chalk.bold.red("[ERROR]")} ${chalk.bold(`${currentTime}:`)}: ${message}`);
  }
}

export default Logger;
