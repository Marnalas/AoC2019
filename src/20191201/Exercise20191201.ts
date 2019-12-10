import { IExercise } from "../IExercise";
import getInputMasses from "./input";

export class Exercise20191201 implements IExercise {
  private masses: Array<number>;

  date: string;

  constructor() {
    this.masses = getInputMasses();
    this.date = "01/12/2019";
  }

  private calculateFuel(masse: number): number {
    let fuel: number = Math.floor(masse / 3) - 2;
    return fuel > 0 ? fuel : 0;
  }

  getResult1(): string {
    let sum: number = 0;
    for (let i = 0; i < this.masses.length; ++i)
      sum += this.calculateFuel(this.masses[i]);
    return sum.toString();
  }

  getResult2(): string {
    let sum: number = 0;
    for (let i: number = 0; i < this.masses.length; ++i) {
      let masse = this.masses[i];
      do {
        masse = this.calculateFuel(masse);
        sum += masse;
      } while (masse !== 0);
    }
    return sum.toString();
  }
}
