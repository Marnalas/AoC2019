export class Debugger {
  private isDebug: boolean;

  constructor(isDebug: boolean) {
    this.isDebug = isDebug;
  }

  debug(message: string): void {
    if (this.isDebug) console.log(message);
  }
}
