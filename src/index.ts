// https://adventofcode.com/2019

import { Exercise20191201 } from "./20191201/Exercise20191201";
import { Exercise20191202 } from "./20191202/Exercise20191202";
// import { Exercise20191203 } from "./20191203/Exercise20191203";
import { IExercise } from "./IExercise";

const exercises: Array<IExercise> = new Array<IExercise>();
exercises.push(new Exercise20191201());
exercises.push(new Exercise20191202());
//exercises.push(new Exercise20191203()); Execution too slow

let log: string = "";
for (let i: number = 0; i < exercises.length; ++i) {
  const exercise: IExercise = exercises[i];
  log =
    log +
    `
    <h1>Exercise ${exercise.date} !</h1>
    <div>
      The results you've all been waiting for are ${exercise.getResult1()} and ${exercise.getResult2()}.
    </div>
    `;
}
document.getElementById("app").innerHTML = log;
