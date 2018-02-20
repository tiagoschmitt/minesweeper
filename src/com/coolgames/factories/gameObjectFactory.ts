import { TileDisplayComponent } from "../components/display/tileDisplayComponent";
import { ImageFactory } from "./imageFactory";
import { Sprite } from "pixi.js";
import { GameObject } from "../components/map/gameObject";

class GameObjectFactory {
    
    public static createGameObject(type: string): GameObject {
        var go:GameObject = new GameObject(type);

        return go;
    }
}