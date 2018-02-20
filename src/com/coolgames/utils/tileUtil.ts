import { Tile } from "../components/map/tile";
import { Point } from "pixi.js";

export class TileUtil {
    public static tileSize: number;

    public static getTileByPos(point: Point): Point {
        return new Point(Math.floor(point.x / TileUtil.tileSize), Math.floor(point.y / TileUtil.tileSize));
    }

    public static isNeighbor(tile: Tile, neighbor: Tile): boolean {
        if (Math.abs(tile.x - neighbor.x) > 1 || Math.abs(tile.y - neighbor.y) > 1)
            return false;

        return  true;
    }
}