import { IExercise } from "../IExercise";
import getInputOpcodes from "./input";
import { Debugger } from "../Debugger";

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

export class Exercise20191207 implements IExercise {
  private opcodes: Array<number>;
  private debugger: Debugger;

  date: string;

  constructor() {
    this.date = "07/12/2019";
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

  private getOutputs(phaseSetting: number, inputValue: number): string {
    let output: string = "";

    let i: number = 0;
    let opcodeStr: string;
    let opcode: Partial<OpcodeDetail>;
    let inputProcessed = 0;
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
        i += opcode.size;
      } else if (opcode.type === OpcodesEnum.Input) {
        let [position] = this.getParameters(opcodeStr, opcode, i);
        this.opcodes[position] =
          inputProcessed === 0 ? phaseSetting : inputValue;
        ++inputProcessed;
        i += opcode.size;
      } else if (opcode.type === OpcodesEnum.Output) {
        let [position] = this.getParameters(opcodeStr, opcode, i);
        let partialOutput: string = this.opcodes[position].toString();
        output += `,${partialOutput}`;

        i += opcode.size;
      } else if (
        opcode.type === OpcodesEnum.JumpIf ||
        opcode.type === OpcodesEnum.JumpIfNot
      ) {
        let [firstValue, position] = this.getParameters(opcodeStr, opcode, i);
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
        i += opcode.size;
      } else break;
    } while (i < this.opcodes.length);

    return output;
  }

  getResult1(): string {
    let [psMin, psMax] = ["0", "4"];
    let [ps1Max, ps2Max, ps3Max, ps4Max, ps5Max] = [0, 0, 0, 0, 0];

    this.debugger = new Debugger(false);
    let maxThrusterSignal = 0;
    for (let ps1 = +psMin; ps1 <= +psMax; ++ps1) {
      for (let ps2 = +psMin; ps2 <= +psMax; ++ps2) {
        if (ps2 !== ps1) {
          for (let ps3 = +psMin; ps3 <= +psMax; ++ps3) {
            if ([ps1, ps2].find(ps => ps === ps3) === undefined) {
              for (let ps4 = +psMin; ps4 <= +psMax; ++ps4) {
                if ([ps1, ps2, ps3].find(ps => ps === ps4) === undefined) {
                  for (let ps5 = +psMin; ps5 <= +psMax; ++ps5) {
                    if (
                      [ps1, ps2, ps3, ps4].find(ps => ps === ps5) === undefined
                    ) {
                      let nextInput = 0;
                      for (let i = 0; i < 5; ++i) {
                        this.opcodes = getInputOpcodes();
                        let phaseSetting = 0;
                        switch (i) {
                          case 0:
                            phaseSetting = ps1;
                            break;
                          case 1:
                            phaseSetting = ps2;
                            break;
                          case 2:
                            phaseSetting = ps3;
                            break;
                          case 3:
                            phaseSetting = ps4;
                            break;
                          case 4:
                            phaseSetting = ps5;
                            break;
                        }
                        const outputs: Array<string> = this.getOutputs(
                          phaseSetting,
                          nextInput
                        ).split(",");
                        nextInput = +outputs[outputs.length - 1];
                      }
                      if (maxThrusterSignal < nextInput) {
                        maxThrusterSignal = nextInput;
                        [ps1Max, ps2Max, ps3Max, ps4Max, ps5Max] = [
                          ps1,
                          ps2,
                          ps3,
                          ps4,
                          ps5
                        ];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    this.debugger.debug(
      `${ps1Max},${ps2Max},${ps3Max},${ps4Max},${ps5Max} ${maxThrusterSignal}`
    );
    return maxThrusterSignal.toString();
  }

  getResult2(): string {
    return "not implemented yet";
  }
}
