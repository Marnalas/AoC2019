import { IExercise } from "../IExercise";
import getInputOrbites from "./input";
import { Debugger } from "../Debugger";

interface SpaceObject {
  id: string;
  orbiting: SpaceObject;
  orbitedBy: Array<SpaceObject>;
  hasBeenIndexed: boolean;
  cntOrbits: number;
}

enum KnownSpaceObjectTypeEnum {
  COM,
  YOU,
  SAN
}

interface KnownSpaceObject {
  type: KnownSpaceObjectTypeEnum;
  spaceObject: SpaceObject;
}

const knownSpaceObjectsMap: Map<
  KnownSpaceObjectTypeEnum,
  Partial<KnownSpaceObject>
> = new Map([
  [KnownSpaceObjectTypeEnum.COM, { type: KnownSpaceObjectTypeEnum.COM }],
  [KnownSpaceObjectTypeEnum.YOU, { type: KnownSpaceObjectTypeEnum.YOU }],
  [KnownSpaceObjectTypeEnum.SAN, { type: KnownSpaceObjectTypeEnum.SAN }]
]);

export class Exercise20191206 implements IExercise {
  private orbites: Array<string>;
  private spaceObjects: Array<SpaceObject>;
  private debugger: Debugger;

  date: string;

  constructor() {
    this.orbites = getInputOrbites();
    this.date = "06/12/2019";
  }

  private getSpaceObject(id: string): SpaceObject {
    return (
      this.spaceObjects.find(sObj => {
        return sObj.id === id;
      }) || {
        id: id,
        orbiting: null,
        orbitedBy: new Array<SpaceObject>(),
        hasBeenIndexed: false,
        cntOrbits: 0
      }
    );
  }

  private indexSpaceObjects(sObjs: SpaceObject[]): void {
    for (let i = 0; i < sObjs.length; ++i) {
      if (!sObjs[i].hasBeenIndexed) {
        this.spaceObjects.push(sObjs[i]);
        sObjs[i].hasBeenIndexed = true;
        if (KnownSpaceObjectTypeEnum[sObjs[i].id] !== undefined)
          knownSpaceObjectsMap.get(
            KnownSpaceObjectTypeEnum[sObjs[i].id]
          ).spaceObject = sObjs[i];
      }
    }
  }

  private buildSpaceObjects(): void {
    this.spaceObjects = new Array<SpaceObject>();
    for (let i = 0; i < this.orbites.length; ++i) {
      const [orbitedId, orbitingId] = this.orbites[i].split(")");
      const [orbited, orbiting] = [
        this.getSpaceObject(orbitedId),
        this.getSpaceObject(orbitingId)
      ];
      orbited.orbitedBy.push(orbiting);
      orbiting.orbiting = orbited;
      this.indexSpaceObjects([orbited, orbiting]);
    }
    knownSpaceObjectsMap.forEach(
      (value: Partial<KnownSpaceObject>, key: KnownSpaceObjectTypeEnum) => {
        if (value.spaceObject !== undefined)
          this.debugger.debug(`${value.spaceObject.id} indexed`);
      }
    );
  }

  private countTotalOrbites(
    sObj: SpaceObject,
    actualCntOrbites: number
  ): number {
    let newCntOrbites = +actualCntOrbites.toString();
    if (!sObj.cntOrbits) sObj.cntOrbits = actualCntOrbites;
    // limits the console output
    if (!sObj.orbitedBy.length)
      this.debugger.debug(`${sObj.id} ${sObj.cntOrbits}`);
    for (let i = 0; i < sObj.orbitedBy.length; ++i)
      newCntOrbites += this.countTotalOrbites(
        sObj.orbitedBy[i],
        sObj.cntOrbits + 1
      );
    return newCntOrbites;
  }

  private countOrbitesToSanta(
    sObj: SpaceObject,
    comingFromObjId: string,
    actualCntOrbites: number
  ): number {
    let newCntOrbites = +actualCntOrbites.toString();
    let isOnSANPath =
      sObj.orbitedBy.find(x => {
        return KnownSpaceObjectTypeEnum[x.id] === KnownSpaceObjectTypeEnum.SAN;
      }) !== undefined;
    if (!sObj.cntOrbits || newCntOrbites < sObj.cntOrbits)
      sObj.cntOrbits = actualCntOrbites;
    if (!isOnSANPath) {
      let cntOrbites = new Array<number>();
      if (sObj.orbiting && sObj.orbiting.id !== comingFromObjId)
        cntOrbites.push(
          this.countOrbitesToSanta(sObj.orbiting, sObj.id, sObj.cntOrbits + 1)
        );
      for (let i = 0; i < sObj.orbitedBy.length; ++i)
        if (sObj.orbitedBy[i].id !== comingFromObjId)
          cntOrbites.push(
            this.countOrbitesToSanta(
              sObj.orbitedBy[i],
              sObj.id,
              sObj.cntOrbits + 1
            )
          );
      let shortestCntOrbites = 0;
      for (let i = 0; i < cntOrbites.length; ++i) {
        if (cntOrbites[i] !== -1) {
          isOnSANPath = true;
          if (!shortestCntOrbites || cntOrbites[i] < shortestCntOrbites)
            shortestCntOrbites = cntOrbites[i];
        }
      }
      newCntOrbites = shortestCntOrbites;
    }
    this.debugger.debug(`${sObj.id} ${isOnSANPath ? newCntOrbites : -1}`);
    return isOnSANPath ? newCntOrbites : -1;
  }

  getResult1(): string {
    this.debugger = new Debugger(false);
    this.buildSpaceObjects();
    return this.countTotalOrbites(
      knownSpaceObjectsMap.get(KnownSpaceObjectTypeEnum.COM).spaceObject,
      0
    ).toString();
  }

  getResult2(): string {
    this.debugger = new Debugger(false);
    this.buildSpaceObjects();
    return this.countOrbitesToSanta(
      knownSpaceObjectsMap.get(KnownSpaceObjectTypeEnum.YOU).spaceObject
        .orbiting,
      "YOU",
      0
    ).toString();
  }
}
