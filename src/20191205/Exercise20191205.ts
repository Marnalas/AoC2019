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

const opcodesMap: Map<OpcodesEnum, Partial<OpcodeDetail>> = new Map([
  [OpcodesEnum.Add, { type: OpcodesEnum.Add, size: 4 }],
  [OpcodesEnum.Mult, { type: OpcodesEnum.Mult, size: 4 }],
  [OpcodesEnum.Input, { type: OpcodesEnum.Input, size: 2 }],
  [OpcodesEnum.Output, { type: OpcodesEnum.Output, size: 2 }],
  [OpcodesEnum.JumpIf, { type: OpcodesEnum.JumpIf, size: 3 }],
  [OpcodesEnum.JumpIfNot, { type: OpcodesEnum.JumpIfNot, size: 3 }],
  [OpcodesEnum.LessThan, { type: OpcodesEnum.LessThan, size: 4 }],
  [OpcodesEnum.Equal, { type: OpcodesEnum.Equal, size: 4 }],
  [OpcodesEnum.Finish, { type: OpcodesEnum.Finish }]
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
    return valueStr.length - 1 - endIndex >= 0
      ? +valueStr.substring(
          valueStr.length - 1 - endIndex,
          valueStr.length - startIndex
        )
      : valueStr.length === 1 && startIndex === 0
      ? +valueStr
      : 0;
  }

  private getOpcode(value: string): Partial<OpcodeDetail> {
    return opcodesMap.get(this.getValueComponent(value, 0, 1));
  }

  private getParameterMode(value: string, parameterRank: number): number {
    return this.getValueComponent(value, parameterRank + 1, parameterRank + 1);
  }

  private getParameterIndex(
    opcodeStr: string,
    index: number,
    parameterRank: number
  ): number {
    return this.getParameterMode(opcodeStr, parameterRank) !== 0
      ? index + parameterRank
      : this.opcodes[index + parameterRank];
  }

  private getParameters(
    opcodeStr: string,
    opcode: Partial<OpcodeDetail>,
    index: number
  ): Array<number> {
    let params: Array<number> = new Array<number>();

    for (let i = 1; i < opcode.size - 1; ++i)
      params.push(this.opcodes[this.getParameterIndex(opcodeStr, index, i)]);
    params.push(this.getParameterIndex(opcodeStr, index, opcode.size - 1));

    return params;
  }

  private getOutputs(systemID: number): string {
    let output: string = "";

    let i: number = 0;
    let opcodeStr: string;
    let opcode: Partial<OpcodeDetail>;
    do {
      opcodeStr = this.opcodes[i].toString();
      opcode = this.getOpcode(opcodeStr);
      if (opcode.type === OpcodesEnum.Add || opcode.type === OpcodesEnum.Mult) {
        let [firstValue, secondValue, position] = this.getParameters(
          opcodeStr,
          opcode,
          i
        );
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
        let [position] = this.getParameters(opcodeStr, opcode, i);
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
        let [position] = this.getParameters(opcodeStr, opcode, i);

        this.debugger.debug(
          `${i}/${this.opcodes.length} ${opcodeStr} which is ${
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
        let [firstValue, position] = this.getParameters(opcodeStr, opcode, i);

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
        let [firstValue, secondValue, position] = this.getParameters(
          opcodeStr,
          opcode,
          i
        );
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
          }`
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
