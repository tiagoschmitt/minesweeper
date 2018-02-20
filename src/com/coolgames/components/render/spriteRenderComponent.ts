import { Displayable } from "../display/displayable";
import { Renderable } from "./Renderable";
import { Sprite } from "pixi.js";
import { GameObject } from "../map/gameObject";

export class SpriteRenderComponent {
    protected _renderable: Renderable;
    protected _canvas: Sprite;

    constructor(renderable: Renderable) {
        this._renderable = renderable;
        this._canvas = renderable.getCanvas();
    }

    public update() {
        var numChildren: number = this._canvas.children.length;

        if (numChildren > 0) {
            this._canvas.removeChildren(0, numChildren);
        }

        var objects: Array<GameObject> = this._renderable.getObjects();
        var length: number = objects.length;

        for (var i: number = 0; i < length; i++) {
            this._canvas.addChild(objects[i].display.content);
        }
    }
}