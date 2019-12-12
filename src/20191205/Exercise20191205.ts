import { IExercise } from "../IExercise";
import { Debugger } from "../Debugger";
import getInputOpcodes from "./input";

export class Exercise20191205 implements IExercise {
  private opcodes: Array<number>;
  private debugger: Debugger;

  date: string;

  constructor() {
    this.date = "05/12/2019";
  }

  private getValueComponent(
    valueStr: string,
    startIndex: number,
    endIndex: number
  ): number {
    const value: number =
      valueStr.length - 1 - endIndex >= 0
        ? +valueStr.substring(
            valueStr.length - 1 - endIndex,
            valueStr.length - startIndex
          )
        : valueStr.length === 1 && startIndex === 0
        ? +valueStr
        : 0;
    // this.debugger.debug(
    //   `${valueStr} ${valueStr.length} ${valueStr.length -
    //     1 -
    //     endIndex} ${valueStr.length - startIndex} ${value}`
    // );
    return value;
  }

  private getOpcode(value: string): number {
    return this.getValueComponent(value, 0, 1);
  }

  private getParameterMode(value: string, parameterRank: number): number {
    return this.getValueComponent(value, parameterRank + 1, parameterRank + 1);
  }

  private getOutputs(systemID: number): string {
    let output: string = "";

    let i: number = 0;
    let opcodeStr: string;
    let opcode: number;
    do {
      opcodeStr = this.opcodes[i].toString();
      opcode = this.getOpcode(opcodeStr);
      if (opcode === 1 || opcode === 2) {
        let firstValue: number =
          this.getParameterMode(opcodeStr, 1) !== 0
            ? this.opcodes[i + 1]
            : this.opcodes[this.opcodes[i + 1]];
        let secondValue: number =
          this.getParameterMode(opcodeStr, 2) !== 0
            ? this.opcodes[i + 2]
            : this.opcodes[this.opcodes[i + 2]];
        let position: number =
          this.getParameterMode(opcodeStr, 3) !== 0
            ? i + 3
            : this.opcodes[i + 3];
        this.opcodes[position] =
          opcode === 1 ? firstValue + secondValue : firstValue * secondValue;

        this.debugger.debug(
          `${i}/${this.opcodes.length} ${opcodeStr} ${firstValue} ${
            opcode === 1 ? "+" : "x"
          } ${secondValue} = ${this.opcodes[position]} at ${position}`
        );
        i += 4;
      } else if (opcode === 3) {
        let position: number =
          this.getParameterMode(opcodeStr, 1) !== 0
            ? i + 1
            : this.opcodes[i + 1];
        this.opcodes[position] = systemID;

        this.debugger.debug(
          `${i}/${
            this.opcodes.length
          } ${opcodeStr} ${systemID} at ${position} which is ${
            this.opcodes[position]
          }`
        );
        i += 2;
      } else if (opcode === 4) {
        let position: number =
          this.getParameterMode(opcodeStr, 1) !== 0
            ? i + 1
            : this.opcodes[i + 1];

        this.debugger.debug(
          `${i}/${this.opcodes.length} ${opcodeStr} at ${position} which is ${
            this.opcodes[position]
          }`
        );
        let partialOutput: string = this.opcodes[position].toString();
        output += `,${partialOutput}`;

        i += 2;
      } else if (opcode === 5 || opcode === 6) {
        let firstValue: number =
          this.getParameterMode(opcodeStr, 1) !== 0
            ? this.opcodes[i + 1]
            : this.opcodes[this.opcodes[i + 1]];
        let position: number =
          this.getParameterMode(opcodeStr, 2) !== 0
            ? i + 2
            : this.opcodes[i + 2];

        this.debugger.debug(
          `${i}/${
            this.opcodes.length
          } ${opcodeStr} ${firstValue} ${(firstValue !== 0 && opcode === 5) ||
            (firstValue === 0 && opcode === 6)} ${this.getParameterMode(
            opcodeStr,
            2
          )}?${this.opcodes[i + 2]};${
            this.opcodes[this.opcodes[i + 2]]
          } going to ${
            (firstValue !== 0 && opcode === 5) ||
            (firstValue === 0 && opcode === 6)
              ? this.opcodes[position]
              : i + 3
          }`
        );
        i =
          (firstValue !== 0 && opcode === 5) ||
          (firstValue === 0 && opcode === 6)
            ? this.opcodes[position]
            : i + 3;
      } else if (opcode === 7 || opcode === 8) {
        let firstValue: number =
          this.getParameterMode(opcodeStr, 1) !== 0
            ? this.opcodes[i + 1]
            : this.opcodes[this.opcodes[i + 1]];
        let secondValue: number =
          this.getParameterMode(opcodeStr, 2) !== 0
            ? this.opcodes[i + 2]
            : this.opcodes[this.opcodes[i + 2]];
        let position: number =
          this.getParameterMode(opcodeStr, 3) !== 0
            ? i + 3
            : this.opcodes[i + 3];
        this.opcodes[position] =
          (opcode === 7 && firstValue < secondValue) ||
          (opcode === 8 && firstValue === secondValue)
            ? 1
            : 0;

        this.debugger.debug(
          `${i}/${this.opcodes.length} ${opcodeStr} ${firstValue} ${
            opcode === 7 || opcode === 8 ? "<" : "==="
          } ${secondValue} = ${
            (opcode === 7 && firstValue < secondValue) ||
            (opcode === 8 && firstValue === secondValue)
              ? 1
              : 0
          } ${this.getParameterMode(opcodeStr, 3)}?${this.opcodes[i + 3]};${
            this.opcodes[this.opcodes[i + 3]]
          } at ${position}`
        );
        i += 4;
      } else {
        this.debugger.debug(`${i}/${this.opcodes.length} ${opcodeStr}`);
        break;
      }
    } while (i < this.opcodes.length);

    return output;
  }

  getResult1(): string {
    this.opcodes = getInputOpcodes();
    this.debugger = new Debugger(false);
    const outputs: Array<string> = this.getOutputs(1).split(",");
    return outputs[outputs.length - 1];
  }

  getResult2(): string {
    this.opcodes = getInputOpcodes();
    this.debugger = new Debugger(false);
    const outputs: Array<string> = this.getOutputs(5).split(",");
    return outputs[outputs.length - 1];
  }
}
