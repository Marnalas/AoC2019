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
  stepsStart: number;
};

type Intersection = {
  distancePart1: number;
  distancePart2: number;
  point: Point;
};

type IntersectionsResult = {
  closestIntersectionPart1: Intersection;
  closestIntersectionPart2: Intersection;
};

export class Exercise20191203 implements IExercise {
  private wiresDirections: WiresDirections;
  private closestIntersectionPart1: Intersection;
  private closestIntersectionPart2: Intersection;

  date: string;

  constructor() {
    this.wiresDirections = getInputWiresDirections();
    this.date = "03/12/2019";

    const closestIntersections: IntersectionsResult = this.getClosestIntersection(
      this.getLines(this.wiresDirections.wire1),
      this.getLines(this.wiresDirections.wire2)
    );
    this.closestIntersectionPart1 =
      closestIntersections.closestIntersectionPart1;
    this.closestIntersectionPart2 =
      closestIntersections.closestIntersectionPart2;
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
        end: null,
        stepsStart: 0
      };
      if (direction === "R" || direction === "L")
        currentX += direction === "R" ? distance : -distance;
      else currentY += direction === "U" ? distance : -distance;
      line.end = { x: currentX, y: currentY };
      line.position =
        line.start.x === line.end.x ? Position.Vertical : Position.Horizontal;
      line.stepsStart =
        lines.length > 0
          ? lines[lines.length - 1].stepsStart +
            (lines[lines.length - 1].position === Position.Horizontal
              ? Math.abs(
                  lines[lines.length - 1].start.x -
                    lines[lines.length - 1].end.x
                )
              : Math.abs(
                  lines[lines.length - 1].start.y -
                    lines[lines.length - 1].end.y
                ))
          : 0;
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
          distancePart1:
            Math.abs(verticalLine.start.x) + Math.abs(horizontalLine.start.y),
          distancePart2:
            verticalLine.stepsStart +
            horizontalLine.stepsStart +
            Math.abs(verticalLine.start.x - horizontalLine.start.x) +
            Math.abs(horizontalLine.start.y - verticalLine.start.y),
          point: { x: verticalLine.start.x, y: horizontalLine.start.y }
        }
      : {
          distancePart1: Number.MAX_SAFE_INTEGER,
          distancePart2: Number.MAX_SAFE_INTEGER,
          point: null
        };
  }

  private getClosestIntersection(
    linesWire1: Array<Line>,
    linesWire2: Array<Line>
  ): IntersectionsResult {
    let closestIntersectionPart1: Intersection = {
        distancePart1: Number.MAX_SAFE_INTEGER,
        distancePart2: Number.MAX_SAFE_INTEGER,
        point: null
      },
      closestIntersectionPart2: Intersection = {
        distancePart1: Number.MAX_SAFE_INTEGER,
        distancePart2: Number.MAX_SAFE_INTEGER,
        point: null
      },
      intersection: Intersection = {
        distancePart1: Number.MAX_SAFE_INTEGER,
        distancePart2: Number.MAX_SAFE_INTEGER,
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
          (line1.start.x !== 0 ||
            line1.start.y !== 0 ||
            line2.start.x !== 0 ||
            line2.start.y !== 0) &&
          ((line1.position === Position.Horizontal &&
            line2.position === Position.Horizontal &&
            line1.start.y === line2.start.y) ||
            (line1.position === Position.Vertical &&
              line2.position === Position.Vertical &&
              line1.start.x === line2.start.x))
        )
          intersection =
            line1.position === Position.Horizontal
              ? {
                  distancePart1:
                    Math.max(Math.abs(line1.start.x), Math.abs(line2.start.x)) +
                    Math.abs(line1.start.y),
                  distancePart2:
                    line1.stepsStart +
                    line2.stepsStart +
                    Math.abs(line1.start.x - line2.start.x),
                  point: {
                    x: Math.max(line1.start.x, line2.start.x),
                    y: line1.start.y
                  }
                }
              : {
                  distancePart1:
                    Math.abs(line1.start.x) +
                    Math.max(Math.abs(line1.start.y), Math.abs(line2.start.y)),
                  distancePart2:
                    line1.stepsStart +
                    line2.stepsStart +
                    Math.abs(line1.start.y - line2.start.y),
                  point: {
                    x: line1.start.x,
                    y: Math.max(line1.start.y, line2.start.y)
                  }
                };
        else
          intersection = {
            distancePart1: Number.MAX_SAFE_INTEGER,
            distancePart2: Number.MAX_SAFE_INTEGER,
            point: null
          };
        if (intersection.distancePart1 < closestIntersectionPart1.distancePart1)
          closestIntersectionPart1 = intersection;
        if (intersection.distancePart2 < closestIntersectionPart2.distancePart2)
          closestIntersectionPart2 = intersection;
      }
    }

    return {
      closestIntersectionPart1: closestIntersectionPart1,
      closestIntersectionPart2: closestIntersectionPart2
    };
  }

  getResult1(): string {
    return this.closestIntersectionPart1.distancePart1.toString();
  }

  getResult2(): string {
    return this.closestIntersectionPart2.distancePart2.toString();
  }
}
