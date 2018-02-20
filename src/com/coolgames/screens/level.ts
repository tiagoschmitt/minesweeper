import { Rectangle } from "pixi.js";

export class Level {
    public levelId: number;
    public mapWidth: number;
    public mapHeight: number;
    public numBombs: number;
    public bombsPosition:Array<any>;

    constructor(levelId: number, mapWidth: number, mapHeight: number, numBombs: number, bombsPosition: Array<any>) {
        this.levelId = levelId;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.numBombs = numBombs;
        this.bombsPosition = bombsPosition;
    }
}