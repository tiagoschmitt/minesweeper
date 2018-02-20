import { Displayable } from "../display/displayable";
import { ImageFactory } from "../../factories/imageFactory";
import { Game } from "../../../../game";
import { Pool } from "../../pool/pool";
import { DisplayComponent } from "../display/displayComponent";

export class GameObject {
    public static EMPTY: string = "empty";
    public static NORMAL: string = "normal";
    public static FLAG: string = "flag";
    public static BOMB: string = "bomb";
    public static BOMB_EXPLODED: string = "bomb_exploded";
    public static BOMB_WRONG: string = "bomb_wrong_flag";
    public static QUESTIONMARK: string = "questionmark";
    public static QUESTIONMARK_PRESSED: string = "questionmark_pressed";
    public static NUM_1: string = "1";
    public static NUM_2: string = "2";
    public static NUM_3: string = "3";
    public static NUM_4: string = "4";
    public static NUM_5: string = "5";
    public static NUM_6: string = "6";
    public static NUM_7: string = "7";
    public static NUM_8: string = "8";
  
    protected _type: string;
    protected _state: string;
    protected _display: DisplayComponent;
    
    constructor(type: string) {
        this._type = type;
        
        this.state = GameObject.NORMAL;
    }

    public set type(type: string) {
        this._type = type;
    }

    public get type(): string {
        return this._type;
    }

    public set state(state: string) {
        if (this._state != state) {
            this._state = state;

            this.createDisplayComponent();
        }
    }

    public get state(): string {
        return this._state;
    }

    public get display():DisplayComponent {
        return this._display;
    }

    public clear() {
        this._display = null;
    }

    private createDisplayComponent() {
        var display:DisplayComponent = Game.instance.displayFactory.get("tile_" + this._state) as DisplayComponent;
        
        if (this._display != null) {
            var x: number = this._display.x;
            var y: number = this._display.y;
            display.position(x, y);

            Pool.instance.release(this._display as DisplayComponent);
        }

        this._display = display;
    }
}