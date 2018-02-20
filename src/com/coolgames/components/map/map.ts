import { DisplayObject, Sprite } from "pixi.js";
import { Tile } from "./tile";
import { GameObject } from "./gameObject";
import { SpriteRenderComponent } from "../render/spriteRenderComponent";
import { Renderable } from "../render/renderable";
import { Displayable } from "../display/displayable";
import { Level } from "../../screens/level";
import { Pool } from "../../pool/pool";

export class Map implements Renderable {
    protected _tileSize: number;
    protected _canvas: Sprite;
    protected _level: Level;
    protected _mapChanged: boolean;
    protected _tiles:Array<Tile>;
    protected _render:SpriteRenderComponent;
    protected _objectList: Array<GameObject>;

    constructor(tileSize: number, canvas: Sprite) {
        this._tileSize = tileSize;
        this._canvas = canvas;
    }

    public get tiles():Array<Tile> {
        return this._tiles;
    }

    public start(level: Level) {
        this._level = level;
        
        this.createTiles();
        this.createRender();
        this.createObjectList();
    }

    public add(object: GameObject):void {
        this._mapChanged = true;

        var index: number = object.display.y * this._level.mapWidth + object.display.x;

        if (index <= this._tiles.length -1) {
            var tile:Tile = this._tiles[index];
            
            if (!tile.isBusy()) {
                tile.object = object;
                return;
            }
        }
    }

    public remove(element: GameObject, tile:Tile) {
        var length: number = this._tiles.length;

        this._mapChanged = true;
        
        for (var i: number = 0; i < length; i++) {
            if (this._tiles[i].object == element) {
                this._tiles[i].clear();
                return;
            }
        }
    }

    public getTile(x: number, y:number): Tile {
        var index: number = y * this._level.mapWidth + x;

        if (index <= this._tiles.length -1) {
            return this._tiles[index];
        }

        return null;
    }

    public getNeighbors(tile: Tile): Array<Tile> {
        var neighbors: Array<Tile> = new Array<Tile>();
        var startX = tile.x - 1;
        var startY = tile.y - 1;
        var endX = tile.x + 1;
        var endY = tile.y + 1;

        if (startX < 0)
            startX = tile.x;

        if (startY < 0)
            startY = tile.y;

        if (endX > this._level.mapWidth - 1)
            endX = tile.x;

        if (endY > this._level.mapHeight - 1)
            endY = tile.y;


        for (var i: number = startX; i <= endX; i++) {
            for (var j: number = startY; j <= endY; j++) {
                var currentTile: Tile = this.getTile(i, j);

                if (currentTile != tile) {
                    neighbors.push(currentTile);
                }
            }
        }

        return neighbors;
    }

    public update() {
        if (this._mapChanged) {
            this._mapChanged = false;
            
            this.createObjectList();
        }
        
        this._render.update();
    }

    public getCanvas(): Sprite {
        return this._canvas;
    }

    public getObjects(): Array<GameObject> {
        return this._objectList;
    }

    public clear() {
        this._canvas = null;
        this._level = null;
        this._tiles = null;
    
        for (var i: number = 0; i < this._objectList.length; i++) {
            this._objectList[i].display.clear();
            Pool.instance.release(this._objectList[i].display);
            this._objectList[i].clear();
        }

        this._objectList = null;
    }

    protected createTiles() {
        var width: number = this._level.mapWidth;
        var height: number = this._level.mapHeight;
        
        this._tiles = new Array<Tile>();
        
        for (var i: number = 0; i < height; i++) {
            for (var j: number = 0; j < width; j++) {
                this._tiles.push(new Tile(j, i));
            }
        }
    }

    protected createRender() {
        this._render = new SpriteRenderComponent(this);
    }

    protected createObjectList()  {
        this._objectList = new Array<GameObject>();
        
        var length: number = this._tiles.length;
        
        for (var i: number = 0; i < length; i++) {
            if (this._tiles[i].object != null) {
                this._objectList.push(this._tiles[i].object);
            }
        }
    }
}