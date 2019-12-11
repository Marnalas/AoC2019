import { IExercise } from "../IExercise";
import getInputRange, { Range } from "./input";

type GetHasDouble = (
  charN2: string,
  previousChar: string,
  currentChar: string,
  nextChar: string
) => boolean;

const isNumeric = (n: string): boolean => {
  const numeric: number = parseFloat(n);
  return !isNaN(numeric) && isFinite(numeric);
};

export class Exercise20191204 implements IExercise {
  private range: Range;

  date: string;

  constructor() {
    this.range = getInputRange();
    this.date = "04/12/2019";
  }

  private countValidPasswords(getHasDouble: GetHasDouble): number {
    let cntValidPasswords: number = 0;
    let validPasswords: Array<Number> = new Array<number>();
    let currentPassword: string;
    let is6Digits: boolean, hasDouble: boolean, isIncreasing: boolean;

    for (let i = this.range.min; i < this.range.max; ++i) {
      currentPassword = i.toString();
      is6Digits = true;
      hasDouble = false;
      isIncreasing = true;
      if (currentPassword.length === 6) {
        let charN2: string = "x",
          previousChar: string = currentPassword.charAt(0),
          currentChar: string,
          nextChar: string;
        if (!isNumeric(previousChar)) {
          is6Digits = false;
          break;
        }
        for (let j = 1; j < currentPassword.length; ++j) {
          currentChar = currentPassword.charAt(j);
          nextChar =
            j < currentPassword.length - 1
              ? currentPassword.charAt(j + 1)
              : "x";
          if (!isNumeric(currentChar)) {
            is6Digits = false;
            break;
          }
          if (parseFloat(previousChar) > parseFloat(currentChar)) {
            isIncreasing = false;
            break;
          }
          if (
            !hasDouble &&
            getHasDouble(charN2, previousChar, currentChar, nextChar)
          )
            hasDouble = true;
          charN2 = previousChar;
          previousChar = currentChar;
        }
      } else is6Digits = false;
      if (is6Digits && hasDouble && isIncreasing) {
        ++cntValidPasswords;
        validPasswords.push(i);
      }
    }

    return cntValidPasswords;
  }

  getResult1(): string {
    const getHasDouble: GetHasDouble = (
      charN2: string,
      previousChar: string,
      currentChar: string,
      nextChar: string
    ): boolean => {
      return currentChar === previousChar;
    };
    return this.countValidPasswords(getHasDouble).toString();
  }

  getResult2(): string {
    const getHasDouble: GetHasDouble = (
      charN2: string,
      previousChar: string,
      currentChar: string,
      nextChar: string
    ): boolean => {
      return (
        currentChar === previousChar &&
        currentChar !== charN2 &&
        currentChar !== nextChar
      );
    };
    return this.countValidPasswords(getHasDouble).toString();
  }
}
