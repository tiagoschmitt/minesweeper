import { Texture, Sprite } from "pixi.js";
import { Pool } from "../pool/pool";

export class ImageFactory {
    public getImage(imageId: string):Sprite {
        return new Sprite(Texture.fromFrame(imageId));
    }
}