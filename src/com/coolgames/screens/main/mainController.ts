import { Game } from "../../../../game";
import { GameObject } from "../../components/map/gameObject";
import { LoadEvent } from "../../events/loadEvent";
import { Level } from "../level";
import { MapController } from "../map/mapController";

export class MainController extends PIXI.utils.EventEmitter {
    private _levels:Array<Level>;
    private _activeLevel: Level;

    private _mapController: MapController;

    constructor() {
        super();

        var loader:PIXI.loaders.Loader = new PIXI.loaders.Loader();
        loader.add("sprites", "./assets/sprites.json");
        loader.add("levels","./assets/levels.json", {"aeee": this});
        loader.load(this.onFilesLoad.bind(this));
    }

    public startLevel(levelId: number) {
        this._activeLevel = this._levels[levelId - 1];
    }

    public nextLevel() {
        if (this._activeLevel.levelId + 1 <= this._levels.length) {
            this._activeLevel = this._levels[this._activeLevel.levelId];
        }
    }

    public get activeLevel(): Level {
        return this._activeLevel;
    }

    private onFilesLoad(loader: PIXI.loaders.Loader, resources: any) {
        this.setup(resources.levels.data);
        this.emit(LoadEvent.LOAD_COMPLETE);
    }

    private setup(levels:Array<any>) {
        this.createLevels(levels);
        Game.instance.displayFactory.createImages(this._activeLevel.mapWidth * this._activeLevel.mapHeight);
    }

    private createLevels(levels:Array<any>) {
        this._levels = new Array<Level>();

        for (var i: number = 0; i < levels.length; i++) {
            this._levels.push(new Level(levels[i].levelId, levels[i].mapWidth, levels[i].mapHeight, levels[i].numBombs, levels[i].bombsPosition));
        }

        this._activeLevel = this._levels[0];
    }
}