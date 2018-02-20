import { GameObject } from "./gameObject";

export class Tile {
    protected _x: number;
    protected _y: number;
    protected _object: GameObject

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public get object():GameObject {
        return this._object;
    }

    public set object(object: GameObject) {
        this._object = object;
    }

    public isBusy():boolean {
        return this._object != null;
    }

    public clear() {
        this._object = null;
    }

    public toString(): string {
        return "{" + this._x + ", " + this._y + "}";
    }
}