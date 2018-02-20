import { DisplayObject } from "pixi.js";
import { Displayable } from "./displayable";
import { Reusable } from "../../pool/reusable";

export class DisplayComponent implements Displayable, Reusable {
    protected _content: DisplayObject;
    protected _x: number;
    protected _y: number;

    constructor(content: DisplayObject, x?:number, y?:number) {
        this._content = content;
    }

    public get id(): string {
        return this._content.name;
    }
    
    public clear(): void {
        this.position(0, 0);
    }

    set x(x: number) {
        this._x = x;
        this._content.x = x;
    }
    
    get x() {
        return this._x;
    }

    set y(y: number) {
        this._y = y;
        this._content.y = y;
    }

    get y() {
        return this._y;
    }

    position(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public set content(content: DisplayObject) {
        this._content = content;
    }

    public get content() {
        return this._content;
    }
}