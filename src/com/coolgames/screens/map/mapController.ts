import { Level } from "../level";
import { Map } from "../../components/map/map";
import { Game } from "../../../../game";
import { Sprite } from "pixi.js";
import { GameObject } from "../../components/map/gameObject";
import { TileUtil } from "../../utils/tileUtil";
import { Tile } from "../../components/map/tile";

export class MapController extends PIXI.utils.EventEmitter {
    private _level: Level;
    private _map: Map;
    private _isGameOver: boolean;

    constructor(level: Level) {
        super();

        this._level = level;
    }

    public get map(): Map {
        return this._map;
    }

    public get isGameOver(): boolean {
        return this._isGameOver;
    }

    public reset(level?: Level) {
        this._isGameOver = false;

        if (level != null) {
            this._level = level;
        }

        this._map.clear();
    }

    public update() {
        this._map.update();
    }

    public createMap(canvas: Sprite) {
        this._map = new Map(TileUtil.tileSize, canvas);
        this._map.start(this._level);

        this.createBombs();
        this.createEmpties();
        this.defineNeighbors();
    }

    public showObject(go: GameObject) {
        if (go.type == GameObject.BOMB) {
            go.state = GameObject.BOMB_EXPLODED;
            go.type = GameObject.BOMB_EXPLODED;

            this.gameExploded();
        } else if (go.type == GameObject.EMPTY) {
            this.showEmptyNeighbors(go);
            this.verifyGameOver();
        } else {
            go.state = go.type;
            this.verifyGameOver();
        }
    }

    public flag(go: GameObject) {
        if (go.state == GameObject.FLAG) {
            go.state = GameObject.NORMAL;
        } else {
            go.state = GameObject.FLAG;
        }
    }

    private verifyGameOver() {
        var objects: Array<GameObject> = this._map.getObjects();
        var countReveledTiles: number = 0;

        for (var i: number = 0; i < objects.length; i++) {
            if (objects[i].type == objects[i].state) {
                countReveledTiles++;
            }
        }

        var totalTiles: number = this._level.mapWidth * this._level.mapHeight;
        var numBombs: number = this._level.numBombs;

        if (totalTiles - countReveledTiles == numBombs) {
            this.gameOver();
        }
    }

    private gameOver() {
        this._isGameOver = true;
        this.emit(GameEvent.GAME_OVER);
    }

    private gameExploded() {
        this._isGameOver = true;
        this.revealMap();

        this.emit(GameEvent.EXPLODED);
    }

    private createBombs() {
        var numBombs: number = 0;

        for (var i: number = 0; i < this._level.bombsPosition.length; i++) {
            var pos:any = this._level.bombsPosition[i];
            var go: GameObject = new GameObject(GameObject.BOMB);
            go.display.position(pos.x, pos.y);

            this._map.add(go);

            numBombs++;
        }

        while (numBombs < this._level.numBombs) {
            var x: number = Math.floor(Math.random() *  this._level.mapWidth);
            var y: number = Math.floor(Math.random() *  this._level.mapHeight);

            if (!this._map.getTile(x, y).isBusy()) {
                var go: GameObject = new GameObject(GameObject.BOMB);
                go.display.position(x, y);

                this._map.add(go);

                numBombs++;
            }
        }
    }

    private createEmpties() {
        var width: number = this._level.mapWidth;
        var height: number = this._level.mapHeight;
        var go:GameObject;

        for (var i: number = 0; i < height; i++) {
            for (var j: number = 0; j < width; j++) {
                go = new GameObject(GameObject.EMPTY)
                go.display.position(j, i);

                this._map.add(go);
            }
        }
    }

    private defineNeighbors() {
        var tile: Tile;
        var tiles: Array<Tile>;
        var numBombs: number;
        
        for (var i: number = 0; i < this._map.tiles.length; i++) {
            tile = this._map.tiles[i];

            if (tile.object.type != GameObject.BOMB) {
                numBombs = 0;
                tiles = this._map.getNeighbors(tile);

                for (var j: number = 0; j < tiles.length; j++) {
                    if (tiles[j].object.type == GameObject.BOMB) {
                        numBombs++;
                    }
                }

                if (numBombs > 0) {
                    tile.object.type = numBombs.toString();
                }
            }
        }
    }

    private revealMap() {
        var go: GameObject;

        for (var i: number = 0; i < this._map.tiles.length; i++) {
            go = this._map.tiles[i].object;

            if (go.state == GameObject.FLAG) {
                if (go.type == GameObject.BOMB) {
                    go.type = GameObject.FLAG;
                } else {
                    go.type = GameObject.BOMB_WRONG;
                }
            }

            go.state = go.type;
        }
    }

    private showEmptyNeighbors(go: GameObject) {
        var goList = this.getPath(go, []);

        for (var i: number = 0; i < goList.length; i++) {
            goList[i].state = goList[i].type;
        }
    }

    private getPath(go: GameObject, objects:Array<GameObject>):Array<GameObject> {
        var goNear: GameObject;
        
        if (objects.indexOf(go) == -1) {
            objects.push(go);
        }	
            
        for (var i: number = 0; i < this._map.tiles.length; i++) {
            if (TileUtil.isNeighbor(this._map.getTile(go.display.x, go.display.y), this._map.tiles[i]) 
            && (this._map.tiles[i].object.state != GameObject.FLAG)
            && (this._map.tiles[i].object.type != GameObject.BOMB)
            && objects.indexOf(this._map.tiles[i].object) == -1) {
                goNear = this._map.tiles[i].object;
                objects.push(goNear);

                if (goNear.type == GameObject.EMPTY) {
                    this.getPath(goNear, objects);
                }
            }
        }

        return objects;
    }
}