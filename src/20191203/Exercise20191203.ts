import { IExercise } from "../IExercise";
import getInputWiresDirections, { WiresDirections } from "./input";

type Point = {
  x: number;
  y: number;
};

enum Position {
  Vertical,
  Horizontal
}

type Line = {
  position: Position;
  start: Point;
  end: Point;
};

type Intersection = {
  distance: number;
  point: Point;
};

export class Exercise20191203 implements IExercise {
  private wiresDirections: WiresDirections;

  date: string;

  constructor() {
    this.wiresDirections = getInputWiresDirections();
    this.date = "03/12/2019";
  }

  private getLines(directions: Array<string>): Array<Line> {
    const lines: Array<Line> = new Array<Line>();

    let currentX: number = 0,
      currentY: number = 0,
      distance: number = 0;
    let direction: string = "";
    for (let i = 0; i < directions.length; ++i) {
      direction = directions[i].substring(0, 1);
      distance = +directions[i].substring(1, directions[i].length);
      const line: Line = {
        position: null,
        start: { x: currentX, y: currentY },
        end: null
      };
      if (direction === "R" || direction === "L")
        currentX += direction === "R" ? distance : -distance;
      else currentY += direction === "U" ? distance : -distance;
      line.end = { x: currentX, y: currentY };
      line.position =
        line.start.x === line.end.x ? Position.Vertical : Position.Horizontal;
      lines.push(line);
    }

    return lines;
  }

  private getIntersectionFromHorizontalAndVerticalLines(
    horizontalLine: Line,
    verticalLine: Line
  ): Intersection {
    return (verticalLine.start.x !== 0 ||
      verticalLine.start.y !== 0 ||
      horizontalLine.start.x !== 0 ||
      horizontalLine.start.y !== 0) &&
      verticalLine.start.x >=
        Math.min(horizontalLine.start.x, horizontalLine.end.x) &&
      verticalLine.start.x <=
        Math.max(horizontalLine.start.x, horizontalLine.end.x) &&
      horizontalLine.start.y >=
        Math.min(verticalLine.start.y, verticalLine.end.y) &&
      horizontalLine.start.y <=
        Math.max(verticalLine.start.y, verticalLine.end.y)
      ? {
          distance:
            Math.abs(verticalLine.start.x) + Math.abs(horizontalLine.start.y),
          point: { x: verticalLine.start.x, y: horizontalLine.start.y }
        }
      : {
          distance: Number.MAX_SAFE_INTEGER,
          point: null
        };
  }

  private getClosestIntersection(
    linesWire1: Array<Line>,
    linesWire2: Array<Line>
  ): Intersection {
    let closestIntersection: Intersection = {
        distance: Number.MAX_SAFE_INTEGER,
        point: null
      },
      intersection: Intersection = {
        distance: Number.MAX_SAFE_INTEGER,
        point: null
      };

    let line1: Line, line2: Line;
    for (let i = 0; i < linesWire1.length; ++i) {
      line1 = linesWire1[i];
      for (let j = 0; j < linesWire2.length; ++j) {
        line2 = linesWire2[j];
        if (
          (line1.position === Position.Vertical &&
            line2.position === Position.Horizontal) ||
          (line1.position === Position.Horizontal &&
            line2.position === Position.Vertical)
        )
          intersection = this.getIntersectionFromHorizontalAndVerticalLines(
            line1.position === Position.Horizontal ? line1 : line2,
            line1.position === Position.Vertical ? line1 : line2
          );
        else if (
          ((line1.start.x !== 0 ||
            line1.start.y !== 0 ||
            line2.start.x !== 0 ||
            line2.start.y !== 0) &&
            (line1.position === Position.Horizontal &&
              line2.position === Position.Horizontal &&
              line1.start.y === line2.start.y)) ||
          (line1.position === Position.Vertical &&
            line2.position === Position.Vertical &&
            line1.start.x === line2.start.x)
        )
          intersection =
            line1.position === Position.Horizontal
              ? {
                  distance:
                    Math.max(Math.abs(line1.start.x), Math.abs(line2.start.x)) +
                    Math.abs(line1.start.y),
                  point: {
                    x: Math.max(line1.start.x, line2.start.x),
                    y: line1.start.y
                  }
                }
              : {
                  distance:
                    Math.abs(line1.start.x) +
                    Math.max(Math.abs(line1.start.y), Math.abs(line2.start.y)),
                  point: {
                    x: line1.start.x,
                    y: Math.max(line1.start.y, line2.start.y)
                  }
                };
        else
          intersection = {
            distance: Number.MAX_SAFE_INTEGER,
            point: null
          };
        if (intersection.distance < closestIntersection.distance) {
          closestIntersection = intersection;
          // console.debug(
          //   `${line1.position === Position.Vertical ? "v" : "h"} ${
          //     line1.start.x
          //   }:${line1.start.y} ${line1.end.x}:${line1.end.y} ${
          //     line2.position === Position.Vertical ? "v" : "h"
          //   } ${line2.start.x}:${line2.start.y} ${line2.end.x}:${line2.end.y}`
          // );
          // console.debug(
          //   `${closestIntersection.distance} ${closestIntersection.point.x}:${
          //     closestIntersection.point.y
          //   }`
          // );
        }
      }
    }

    return closestIntersection;
  }

  getResult1(): string {
    const closestIntersection: Intersection = this.getClosestIntersection(
      this.getLines(this.wiresDirections.wire1),
      this.getLines(this.wiresDirections.wire2)
    );

    return closestIntersection.distance.toString();
  }

  getResult2(): string {
    return "not yet implemented";
  }
}
