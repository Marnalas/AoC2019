import { IExercise } from "../IExercise";
import getInputWiresDirections, { WiresDirections } from "./input";

type Position = {
  x: number;
  y: number;
};

type Intersection = {
  distance: number;
  position: Position;
};

type ProcessedIntersections = {
  closestIntersection: Intersection;
  intersections: Array<Intersection>;
};

export class Exercise20191203 implements IExercise {
  private wiresDirections: WiresDirections;

  date: string;

  constructor() {
    this.wiresDirections = getInputWiresDirections();
    this.date = "03/12/2019";
  }

  private getPositions(directions: Array<string>): Array<Position> {
    const positions: Array<Position> = new Array<Position>();

    let currentX: number = 0,
      currentY: number = 0,
      distance: number = 0;
    let direction: string = "";
    for (let i = 0; i < directions.length; ++i) {
      direction = directions[i].substring(0, 1);
      distance = +directions[i].substring(1, directions[i].length);
      // console.log(`${directions[i]} ${direction} ${distance}`);
      if (direction === "R" || direction === "L") {
        for (let j = 0; j < distance; ++j) {
          currentX += direction === "R" ? 1 : -1;
          // console.log(`${currentX} ${currentY}`);
          positions.push({ x: currentX, y: currentY });
        }
      } else {
        for (let j = 0; j < distance; ++j) {
          currentY += direction === "U" ? 1 : -1;
          // console.log(`${currentX} ${currentY}`);
          positions.push({ x: currentX, y: currentY });
        }
      }
    }

    return positions;
  }

  private getProcessedIntersections(
    positionsWire1: Array<Position>,
    positionsWire2: Array<Position>
  ): ProcessedIntersections {
    const intersections: Array<Intersection> = new Array<Intersection>();
    let closestIntersection: Intersection = {
      distance: Number.MAX_VALUE,
      position: null
    };

    for (let i = 0; i < positionsWire1.length; ++i) {
      for (let j = 0; j < positionsWire2.length; ++j) {
        if (
          positionsWire1[i].x === positionsWire2[j].x &&
          positionsWire1[i].y === positionsWire2[j].y
        ) {
          const intersection: Intersection = {
            distance:
              Math.abs(positionsWire1[i].x) + Math.abs(positionsWire1[i].y),
            position: positionsWire1[i]
          };
          intersections.push(intersection);
          if (intersection.distance < closestIntersection.distance)
            closestIntersection = intersection;
        }
      }
    }

    return {
      closestIntersection: closestIntersection,
      intersections: intersections
    };
  }

  getResult1(): string {
    const processedIntersections: ProcessedIntersections = this.getProcessedIntersections(
      this.getPositions(this.wiresDirections.wire1),
      this.getPositions(this.wiresDirections.wire2)
    );

    return processedIntersections.closestIntersection.distance.toString();
  }

  getResult2(): string {
    return "not yet implemented";
  }
}
