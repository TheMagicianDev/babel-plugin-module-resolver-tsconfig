export class Logger {
  public info(msg: string): void {
    console.log(msg);
  }
}

export default new Logger();
