import { Sprite, Text } from "pixi.js";
import { MainController } from "./mainController";
import { MapController } from "../map/mapController";
import { MapView } from "../map/mapView";
import { Game } from "../../../../game";
import { TileUtil } from "../../utils/tileUtil";
import { SmileButton } from "./smileButton";

export class MainView implements View {
    private _mainController: MainController;
    private _container: Sprite;
    private _mapController: MapController;
    private _mapView: MapView;
    private _smileButton: SmileButton;
    private _text: Text;

    constructor(mainController: MainController, container: Sprite) {
        this._mainController = mainController;
        this._container = container;
    }

    public show(): void {
        this.createMapScreen();
        this.createInterface();
        this.resizeCanvas();
        this.showMessage("Level:" + this._mainController.activeLevel.levelId);
    }

    public hide(): void {
    }

    public resizeCanvas() {
        Game.instance.app.view.width = this._mainController.activeLevel.mapWidth * TileUtil.tileSize;
        Game.instance.app.view.height = this._mainController.activeLevel.mapHeight * TileUtil.tileSize + 50;
        
        this._smileButton.x = (Game.instance.app.view.width / 2) - 13;
    }

    private createMapScreen() {
        this._mapController = new MapController(this._mainController.activeLevel);
        
        this._mapView = new MapView(this._mapController);
        this._container.addChild(this._mapView);
        this._mapView.y = 50;
        
        this._mapController.createMap(this._mapView);
        this._mapController.on(GameEvent.GAME_OVER, this.onGameOver.bind(this));
        this._mapController.on(GameEvent.EXPLODED, this.onGameExploded.bind(this));
        
        this._mapView.show();
        this._mapView.on("mousedown", this.onMapMouseDown.bind(this));
        this._mapView.on("mouseup", this.onMapMouseUp.bind(this));
        this._mapView.on("mouseupoutside", this.onMapMouseUp.bind(this));

        Game.instance.app.ticker.add(this.update.bind(this));
    }

    private update() {
        this._mapView.update();
    }

    private createInterface() {
        this._smileButton = new SmileButton();
        this._smileButton.y = 12;
        this._container.addChild(this._smileButton);

        this._smileButton.on(GameEvent.RESET, this.onResetGameClick.bind(this));
    }

    private onGameExploded() {
        this._smileButton.exploded();
    }

    private onGameOver() {
        this._smileButton.gameOver();

        setTimeout(this.startNextLevel.bind(this), 2000);
    }

    private startNextLevel() {
        Game.instance.app.ticker.remove(this.update.bind(this));

        this._mainController.nextLevel();
        this._mapController.reset();
        this._container.removeChild(this._mapView);

        this.createMapScreen();
        this.resizeCanvas();
        this._smileButton.normal();
        this.showMessage("Level: " + this._mainController.activeLevel.levelId);
    }

    private onResetGameClick() {
        this._mapController.reset();
        this._mapController.createMap(this._mapView);
    }

    private onMapMouseDown(e: PIXI.interaction.InteractionEvent) {
        if (e.data.button == 0 && !this._mapController.isGameOver) { 
            this._smileButton.fear();
        }
    }

    private onMapMouseUp(e: PIXI.interaction.InteractionEvent) {
        if (!this._mapController.isGameOver) {
            this._smileButton.normal();
        }
    }

    private showMessage(text: string) {
        if (this._text == null) {
            var style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 12,
            });

            this._text = new Text(text, style);
            this._container.addChild(this._text);

            this._text.x = 5;
            this._text.y = 5;
        }

        this._text.text = text;
    }
}