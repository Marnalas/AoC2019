import { IExercise } from "../IExercise";
import getInputOpcodes from "./input";

export class Exercise20191205 implements IExercise {
  private opcodes: Array<number>;

  date: string;

  constructor() {
    this.opcodes = getInputOpcodes();
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
    // console.log(
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

  private getOutputs(): string {
    let output: string = "";

    let i: number = 0;
    let opcodeStr: string;
    let opcode: number;
    do {
      opcodeStr = this.opcodes[i].toString();
      opcode = this.getOpcode(opcodeStr);
      // console.log(`${i}/${this.opcodes.length} ${opcodeStr} ${opcode}`);
      if (opcode === 1 || opcode === 2) {
        let firstValue: number =
          this.getParameterMode(opcodeStr, 1) !== 0
            ? this.opcodes[i + 1]
            : this.opcodes[this.opcodes[i + 1]];
        let secondValue: number =
          this.getParameterMode(opcodeStr, 2) !== 0
            ? this.opcodes[i + 2]
            : this.opcodes[this.opcodes[i + 2]];
        let position: number = this.opcodes[i + 3];
        this.opcodes[position] =
          opcode === 1 ? firstValue + secondValue : firstValue * secondValue;

        // console.log(
        //   `${i}/${
        //     this.opcodes.length
        //   } ${opcode} ${firstValue} ${secondValue} ${position}`
        // );
        i += 4;
      } else if (opcode === 3) {
        let position: number = this.opcodes[i + 1];
        this.opcodes[position] = 1;

        // console.log(`${i}/${this.opcodes.length} ${opcode} ${position} 1`);
        i += 2;
      } else if (opcode === 4) {
        let position: number = this.opcodes[i + 1];
        let partialOutput: string = this.opcodes[position].toString();
        output += `,${partialOutput}`;

        console.log(
          `${i}/${this.opcodes.length} ${opcode} ${position} ${partialOutput}`
        );
        i += 2;
      } else break;
    } while (i < this.opcodes.length);

    return output;
  }

  getResult1(): string {
    const outputs: Array<string> = this.getOutputs().split(",");
    return outputs[outputs.length - 1];
  }

  getResult2(): string {
    return "not implemented yet";
  }
}
