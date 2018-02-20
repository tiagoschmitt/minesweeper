import { Sprite } from "pixi.js";
import { GameObject } from "../map/gameObject";

export interface Renderable {
    getCanvas():Sprite;
    getObjects():Array<GameObject>;
}