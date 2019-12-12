import { IExercise } from "../IExercise";
import { Debugger } from "../Debugger";
import getInputOpcodes from "./input";

enum OpcodesEnum {
  Add = 1,
  Mult = 2,
  Input = 3,
  Output = 4,
  JumpIf = 5,
  JumpIfNot = 6,
  LessThan = 7,
  Equal = 8,
  Finish = 99
}

type OpcodeDetail = {
  type: OpcodesEnum;
  size: number;
};

const opcodesMap: Map<OpcodesEnum, OpcodeDetail> = new Map([
  [OpcodesEnum.Add, { type: OpcodesEnum.Add, size: 4 }],
  [OpcodesEnum.Mult, { type: OpcodesEnum.Mult, size: 4 }],
  [OpcodesEnum.Input, { type: OpcodesEnum.Input, size: 2 }],
  [OpcodesEnum.Output, { type: OpcodesEnum.Output, size: 2 }],
  [OpcodesEnum.JumpIf, { type: OpcodesEnum.JumpIf, size: 3 }],
  [OpcodesEnum.JumpIfNot, { type: OpcodesEnum.JumpIfNot, size: 3 }],
  [OpcodesEnum.LessThan, { type: OpcodesEnum.LessThan, size: 4 }],
  [OpcodesEnum.Equal, { type: OpcodesEnum.Equal, size: 4 }],
  [OpcodesEnum.Finish, { type: OpcodesEnum.Finish, size: 0 }]
]);

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
    return value;
  }

  private getOpcode(value: string): OpcodeDetail {
    let opcodedetail: OpcodeDetail;
    try {
      opcodedetail = opcodesMap.get(this.getValueComponent(value, 0, 1));
    } catch {
      this.debugger.debug(
        `${value} ${this.getValueComponent(value, 0, 1)} ${opcodesMap.get(
          this.getValueComponent(value, 0, 1)
        )}`
      );
    }
    return opcodedetail;
  }

  private getParameterMode(value: string, parameterRank: number): number {
    return this.getValueComponent(value, parameterRank + 1, parameterRank + 1);
  }

  private getOutputs(systemID: number): string {
    let output: string = "";

    let i: number = 0;
    let opcodeStr: string;
    let opcode: OpcodeDetail;
    do {
      opcodeStr = this.opcodes[i].toString();
      opcode = this.getOpcode(opcodeStr);
      if (opcode.type === OpcodesEnum.Add || opcode.type === OpcodesEnum.Mult) {
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
          opcode.type === OpcodesEnum.Add
            ? firstValue + secondValue
            : firstValue * secondValue;

        this.debugger.debug(
          `${i}/${this.opcodes.length} ${opcodeStr} ${firstValue} ${
            opcode.type === OpcodesEnum.Add ? "+" : "x"
          } ${secondValue} = ${this.opcodes[position]} at ${position}`
        );
        i += opcode.size;
      } else if (opcode.type === OpcodesEnum.Input) {
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
        i += opcode.size;
      } else if (opcode.type === OpcodesEnum.Output) {
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

        i += opcode.size;
      } else if (
        opcode.type === OpcodesEnum.JumpIf ||
        opcode.type === OpcodesEnum.JumpIfNot
      ) {
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
          } ${opcodeStr} ${firstValue} ${(firstValue !== 0 &&
            opcode.type === OpcodesEnum.JumpIf) ||
            (firstValue === 0 &&
              opcode.type === OpcodesEnum.JumpIfNot)} ${this.getParameterMode(
            opcodeStr,
            2
          )}?${this.opcodes[i + 2]};${
            this.opcodes[this.opcodes[i + 2]]
          } going to ${
            (firstValue !== 0 && opcode.type === OpcodesEnum.JumpIf) ||
            (firstValue === 0 && opcode.type === OpcodesEnum.JumpIfNot)
              ? this.opcodes[position]
              : i + opcode.size
          }`
        );
        i =
          (firstValue !== 0 && opcode.type === OpcodesEnum.JumpIf) ||
          (firstValue === 0 && opcode.type === OpcodesEnum.JumpIfNot)
            ? this.opcodes[position]
            : i + opcode.size;
      } else if (
        opcode.type === OpcodesEnum.LessThan ||
        opcode.type === OpcodesEnum.Equal
      ) {
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
          (opcode.type === OpcodesEnum.LessThan && firstValue < secondValue) ||
          (opcode.type === OpcodesEnum.Equal && firstValue === secondValue)
            ? 1
            : 0;

        this.debugger.debug(
          `${i}/${this.opcodes.length} ${opcodeStr} ${firstValue} ${
            opcode.type === OpcodesEnum.LessThan ||
            opcode.type === OpcodesEnum.Equal
              ? "<"
              : "==="
          } ${secondValue} = ${
            (opcode.type === OpcodesEnum.LessThan &&
              firstValue < secondValue) ||
            (opcode.type === OpcodesEnum.Equal && firstValue === secondValue)
              ? 1
              : 0
          } ${this.getParameterMode(opcodeStr, 3)}?${this.opcodes[i + 3]};${
            this.opcodes[this.opcodes[i + 3]]
          } at ${position}`
        );
        i += opcode.size;
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
