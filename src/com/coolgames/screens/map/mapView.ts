import { Sprite, Point } from "pixi.js";
import { MapController } from "./mapController";
import { DisplayComponent } from "../../components/display/displayComponent";
import { TileUtil } from "../../utils/tileUtil";
import { GameObject } from "../../components/map/gameObject";
import { Tile } from "../../components/map/tile";
import { Game } from "../../../../game";

export class MapView extends Sprite implements View {
    private _mapController: MapController;
    private _activeGameObject: GameObject;
    private _isMouseDown: boolean;
    private _mousePosition: Point;

    constructor(mapController: MapController) {
        super();
        this.interactive = true;
        this._mapController = mapController;
        
    }

    public show() {
        this.addEvents();
    }

    public hide() {
    }

    public update() {
        if (this._isMouseDown) {
            var tilePos: Point = TileUtil.getTileByPos(this._mousePosition);
            var tile: Tile = this._mapController.map.getTile(tilePos.x, tilePos.y);
            
            if (tile != null) { 
                var go: GameObject = tile.object;

                if (go.state == GameObject.NORMAL && this._activeGameObject != go) {
                    if (this._activeGameObject != null) {
                        this._activeGameObject.state = GameObject.NORMAL;
                    }

                    this._activeGameObject = go;
                    this._activeGameObject.state = GameObject.EMPTY;
                }
            }
        } else {
            if (this._activeGameObject != null) {
                if (this._activeGameObject.state == GameObject.EMPTY) {
                    this._mapController.showObject(this._activeGameObject);
                }

                this._activeGameObject = null;
            }
        }

        this._mapController.update();
    }

    private addEvents() {
        this.on("mouseupoutside", this.onMouseUp.bind(this));
        this.on("mouseup", this.onMouseUp.bind(this));
        this.on("pointerdown", this.onMouseDown.bind(this));
        this.on("mousemove", this.onMouseMove.bind(this));
    }

     private onMouseDown(e: PIXI.interaction.InteractionEvent) {
        if (this._mapController.isGameOver) {
            return;
        }

        if (e.data.button == 0) { 
            this._isMouseDown = true;
        } else if (e.data.button == 2) {
            var tilePos: Point = TileUtil.getTileByPos(this._mousePosition);
            var tile: Tile = this._mapController.map.getTile(tilePos.x, tilePos.y);

            if (tile != null && (tile.object.state == GameObject.NORMAL || tile.object.state == GameObject.FLAG))  {
                this._mapController.flag(tile.object);
            }
        }
    }

    private onMouseUp(e: PIXI.interaction.InteractionEvent) {
        if (this._mapController.isGameOver) {
            return;
        }

        if (e.data.button == 0) { 
            this._isMouseDown = false;
        }
    }

    private onMouseMove(e:PIXI.interaction.InteractionEvent) {
        if (this._mapController.isGameOver) {
            return;
        }

        this._mousePosition = e.data.getLocalPosition(this);
    }
}