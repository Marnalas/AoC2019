import { IExercise } from "../IExercise";
import getInputOpcodes from "./input";

export class Exercise20191202 implements IExercise {
  private opcodes: Array<number>;

  date: string;

  constructor() {
    this.opcodes = getInputOpcodes();
    this.date = "02/12/2019";
  }

  private getOutput(noun: number, verb: number): number {
    this.opcodes[1] = noun;
    this.opcodes[2] = verb;

    for (let i = 0; i < this.opcodes.length; i += 4)
      if (this.opcodes[i] === 99) break;
      else
        this.opcodes[this.opcodes[i + 3]] =
          this.opcodes[i] === 1
            ? this.opcodes[this.opcodes[i + 1]] +
              this.opcodes[this.opcodes[i + 2]]
            : this.opcodes[this.opcodes[i + 1]] *
              this.opcodes[this.opcodes[i + 2]];
    return this.opcodes[0];
  }

  getResult1(): string {
    return this.getOutput(12, 2).toString();
  }

  getResult2(): string {
    let pairHasBeenFound: boolean = false;
    let noun: number, verb: number;
    for (noun = 0; noun < 100; ++noun) {
      for (verb = 0; verb < 100; ++verb) {
        this.opcodes = getInputOpcodes();
        const ouput: number = this.getOutput(noun, verb);
        if (ouput === 19690720) {
          pairHasBeenFound = true;
          break;
        }
      }
      if (pairHasBeenFound) break;
    }

    return (100 * noun + verb).toString();
  }
}
