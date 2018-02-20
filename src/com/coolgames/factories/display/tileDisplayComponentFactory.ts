import { DisplaylableFactory } from "./displayableFactory";
import { DisplayComponent } from "../../components/display/displayComponent";
import { Pool } from "../../pool/pool";
import { TileDisplayComponent } from "../../components/display/tileDisplayComponent";
import { Game } from "../../../../game";
import { Sprite } from "pixi.js";
import { GameObject } from "../../components/map/gameObject";

export class TileDisplayComponentFactory implements DisplaylableFactory {
    public createImages(numImages: number) {
        for (var i = 0; i < numImages; i++) {
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.EMPTY)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NORMAL)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.FLAG)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.BOMB)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.BOMB_EXPLODED)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.QUESTIONMARK)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.QUESTIONMARK_PRESSED)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_1)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_2)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_3)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_4)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_5)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_6)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_7)));
            Pool.instance.addReusable(new TileDisplayComponent(Game.instance.imageFactory.getImage("tile_" + GameObject.NUM_8)));
        }
    }

    public get(imageId: string): DisplayComponent {
        var diplayComponent: DisplayComponent = Pool.instance.acquire(imageId) as DisplayComponent;

        if (diplayComponent == null) {
            var image: Sprite = Game.instance.imageFactory.getImage(imageId);
            diplayComponent = new TileDisplayComponent(image);
        }

        return diplayComponent;
    }
}