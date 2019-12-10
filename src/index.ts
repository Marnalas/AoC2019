// https://adventofcode.com/2019

import { Exercise20191201 } from "./Exercise20191201";
import { IExercise } from "./IExercise";

const exercises: Array<IExercise> = new Array<IExercise>();
exercises.push(new Exercise20191201());

let log: string = "";
for (let i = 0; i < exercises.length; ++i) {
  const exercise: IExercise = exercises[i];
  log =
    log +
    `
  <h1>Exercise ${exercise.date} !</h1>
  <div>
    The results you've all been waiting for is ${exercise.getResult1()} and ${exercise.getResult2()}.
  </div>
  `;
}
document.getElementById("app").innerHTML = log;
