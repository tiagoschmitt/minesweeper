import { DisplaylableFactory } from "./com/coolgames/factories/display/displayableFactory";
import { ImageFactory } from "./com/coolgames/factories/imageFactory";
import { Application, Sprite } from "pixi.js";
import { TileDisplayComponentFactory } from "./com/coolgames/factories/display/tileDisplayComponentFactory";
import { MainController } from "./com/coolgames/screens/main/mainController";
import { MainView } from "./com/coolgames/screens/main/mainView";
import { LoadEvent } from "./com/coolgames/events/loadEvent";
import { TileUtil } from "./com/coolgames/utils/tileUtil";

export class Game {
    private static _instance: Game;

    private _diplayFactory: DisplaylableFactory;
    private _imageFactory: ImageFactory;
    private _app: Application;
    private _mainView: MainView;

    public static get instance() {
        return Game._instance || (Game._instance = new Game());
    }

    public init() {
        TileUtil.tileSize = 16;
        this._diplayFactory = new TileDisplayComponentFactory();
        this._imageFactory = new ImageFactory();
        
        this.setupPIXI();
        this.createMainScreen();
    }

    public get displayFactory(): DisplaylableFactory {
        return this._diplayFactory;
    }

    public get imageFactory(): ImageFactory {
        return this._imageFactory;
    }

    public get app(): Application {
        return this._app;
    }

    public setupPIXI() {
        this._app = new Application({ 
            width: 256, 
            height: 256,                       
            antialias: true, 
            transparent: false, 
            resolution: 1,
            forceCanvas: true,
            backgroundColor: 0xbdbdbd
          }
        );

        document.body.appendChild(this._app.view);

        this._app.view.addEventListener('contextmenu', (e:any) => {
            e.preventDefault();
        });
    }

    private createMainScreen() {
        var canvas: Sprite = new Sprite();
        this._app.stage.addChild(canvas);

        var mainController: MainController = new MainController();
        mainController.on(LoadEvent.LOAD_COMPLETE, this.onLoadComplete);
        this._mainView = new MainView(mainController, canvas);
    }

    private onLoadComplete() {
        Game.instance._mainView.show();
    }
}