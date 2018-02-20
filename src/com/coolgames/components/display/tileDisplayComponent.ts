import { DisplayObject } from "pixi.js";
import { DisplayComponent } from "./displayComponent";
import { Game } from "../../../../game";
import { TileUtil } from "../../utils/tileUtil";

export class TileDisplayComponent extends DisplayComponent {
    constructor(content: DisplayObject) {
        super(content);
    }

    position(x: number, y: number) {
        this._x = x;
        this._y = y;
        this._content.x = x * TileUtil.tileSize;
        this._content.y = y * TileUtil.tileSize;
    }
}