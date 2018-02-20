import { Sprite } from "pixi.js";
import { Game } from "../../../../game";

export class SmileButton extends Sprite {
    private _smile: Sprite;
    private _smilePressed: Sprite;
    private _smileGameOver: Sprite;
    private _smileExploded: Sprite;
    private _smileFear: Sprite;

    constructor() {
        super();

        this.interactive = true;

        this._smile = Game.instance.imageFactory.getImage("smile");
        this._smilePressed = Game.instance.imageFactory.getImage("smile_pressed");
        this._smileGameOver = Game.instance.imageFactory.getImage("smile_game_over");
        this._smileExploded = Game.instance.imageFactory.getImage("smile_exploded");
        this._smileFear = Game.instance.imageFactory.getImage("smile_fear");
        
        this._smilePressed.visible = false;
        this._smileGameOver.visible = false;
        this._smileExploded.visible = false;
        this._smileFear.visible = false;

        this.addChild(this._smile);
        this.addChild(this._smilePressed);
        this.addChild(this._smileGameOver);
        this.addChild(this._smileExploded);
        this.addChild(this._smileFear);

        this.on("mousedown", this.onMouseDown.bind(this));
        this.on("mouseup",  this.onMouseUp.bind(this));
        this.on("mouseupoutside",  this.onMouseUpOutside.bind(this));
    }

    public normal() {
        this._smile.visible = true;
        this._smileFear.visible = false;
        this._smilePressed.visible = false;
        this._smileExploded.visible = false;
        this._smileGameOver.visible = false;
    }

    public fear() {
        this._smileFear.visible = true;
        this._smile.visible = false;
        this._smilePressed.visible = false;
        this._smileExploded.visible = false;
        this._smileGameOver.visible = false;
        
    }

    public exploded() {
        this._smileExploded.visible = true;
        this._smile.visible = false;
        this._smilePressed.visible = false;
        this._smileGameOver.visible = false;
        this._smileFear.visible = false;
    }

    public gameOver() {
        this._smileGameOver.visible = true;
        this._smile.visible = false;
        this._smilePressed.visible = false;
        this._smileExploded.visible = false;
        this._smileFear.visible = false;
    }

    private onMouseDown() {
        this._smilePressed.visible = true;
        this._smile.visible = false;
        this._smileGameOver.visible = false;
        this._smileExploded.visible = false;
        this._smileFear.visible = false;
    }

    private onMouseUp() {
        this._smile.visible = true;
        this._smilePressed.visible = false;
        this._smileGameOver.visible = false;
        this._smileExploded.visible = false;
        this._smileFear.visible = false;

        this.emit(GameEvent.RESET);
    }

    private onMouseUpOutside() {
        this._smile.visible = true;
        this._smilePressed.visible = false;
    }
}