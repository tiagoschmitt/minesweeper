"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("com/coolgames/components/positionable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("com/coolgames/components/display/displayable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("com/coolgames/factories/display/displayableFactory", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("com/coolgames/pool/reusable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("com/coolgames/pool/pool", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pool = /** @class */ (function () {
        function Pool() {
            this._reusablesFree = new Array();
            this._reusablesUsed = new Array();
        }
        Object.defineProperty(Pool, "instance", {
            get: function () {
                if (!Pool._instance) {
                    Pool._instance = new Pool();
                }
                return Pool._instance;
            },
            enumerable: true,
            configurable: true
        });
        Pool.prototype.addReusable = function (reusable) {
            this._reusablesFree.push(reusable);
        };
        Pool.prototype.acquire = function (id) {
            var length = this._reusablesFree.length;
            var reusable;
            for (var i = 0; i < length; i++) {
                if (this._reusablesFree[i].id == id) {
                    reusable = this._reusablesFree.splice(i, 1)[0];
                    this._reusablesUsed.push(reusable);
                    return reusable;
                }
            }
            return null;
        };
        Pool.prototype.release = function (reusable) {
            var length = this._reusablesUsed.length;
            for (var i = 0; i < length; i++) {
                if (this._reusablesUsed[i] == reusable) {
                    this._reusablesFree.push(this._reusablesUsed.splice(i, 1)[0]);
                    break;
                }
            }
        };
        Pool.prototype.releaseAll = function () {
            var length = this._reusablesUsed.length;
            for (var i = 0; i < length; i++) {
                this._reusablesFree.push(this._reusablesUsed[i]);
            }
            this._reusablesUsed = new Array();
        };
        return Pool;
    }());
    exports.Pool = Pool;
});
define("com/coolgames/factories/imageFactory", ["require", "exports", "pixi.js"], function (require, exports, pixi_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageFactory = /** @class */ (function () {
        function ImageFactory() {
        }
        ImageFactory.prototype.getImage = function (imageId) {
            return new pixi_js_1.Sprite(pixi_js_1.Texture.fromFrame(imageId));
        };
        return ImageFactory;
    }());
    exports.ImageFactory = ImageFactory;
});
define("com/coolgames/components/display/displayComponent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayComponent = /** @class */ (function () {
        function DisplayComponent(content, x, y) {
            this._content = content;
        }
        Object.defineProperty(DisplayComponent.prototype, "id", {
            get: function () {
                return this._content.name;
            },
            enumerable: true,
            configurable: true
        });
        DisplayComponent.prototype.clear = function () {
            this.position(0, 0);
        };
        Object.defineProperty(DisplayComponent.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (x) {
                this._x = x;
                this._content.x = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayComponent.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (y) {
                this._y = y;
                this._content.y = y;
            },
            enumerable: true,
            configurable: true
        });
        DisplayComponent.prototype.position = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Object.defineProperty(DisplayComponent.prototype, "content", {
            get: function () {
                return this._content;
            },
            set: function (content) {
                this._content = content;
            },
            enumerable: true,
            configurable: true
        });
        return DisplayComponent;
    }());
    exports.DisplayComponent = DisplayComponent;
});
define("com/coolgames/components/map/gameObject", ["require", "exports", "game", "com/coolgames/pool/pool"], function (require, exports, game_1, pool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameObject = /** @class */ (function () {
        function GameObject(type) {
            this._type = type;
            this.state = GameObject.NORMAL;
        }
        Object.defineProperty(GameObject.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (type) {
                this._type = type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (state) {
                if (this._state != state) {
                    this._state = state;
                    this.createDisplayComponent();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "display", {
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        GameObject.prototype.clear = function () {
            this._display = null;
        };
        GameObject.prototype.createDisplayComponent = function () {
            var display = game_1.Game.instance.displayFactory.get("tile_" + this._state);
            if (this._display != null) {
                var x = this._display.x;
                var y = this._display.y;
                display.position(x, y);
                pool_1.Pool.instance.release(this._display);
            }
            this._display = display;
        };
        GameObject.EMPTY = "empty";
        GameObject.NORMAL = "normal";
        GameObject.FLAG = "flag";
        GameObject.BOMB = "bomb";
        GameObject.BOMB_EXPLODED = "bomb_exploded";
        GameObject.BOMB_WRONG = "bomb_wrong_flag";
        GameObject.QUESTIONMARK = "questionmark";
        GameObject.QUESTIONMARK_PRESSED = "questionmark_pressed";
        GameObject.NUM_1 = "1";
        GameObject.NUM_2 = "2";
        GameObject.NUM_3 = "3";
        GameObject.NUM_4 = "4";
        GameObject.NUM_5 = "5";
        GameObject.NUM_6 = "6";
        GameObject.NUM_7 = "7";
        GameObject.NUM_8 = "8";
        return GameObject;
    }());
    exports.GameObject = GameObject;
});
define("com/coolgames/components/map/tile", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tile = /** @class */ (function () {
        function Tile(x, y) {
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(Tile.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "object", {
            get: function () {
                return this._object;
            },
            set: function (object) {
                this._object = object;
            },
            enumerable: true,
            configurable: true
        });
        Tile.prototype.isBusy = function () {
            return this._object != null;
        };
        Tile.prototype.clear = function () {
            this._object = null;
        };
        Tile.prototype.toString = function () {
            return "{" + this._x + ", " + this._y + "}";
        };
        return Tile;
    }());
    exports.Tile = Tile;
});
define("com/coolgames/utils/tileUtil", ["require", "exports", "pixi.js"], function (require, exports, pixi_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TileUtil = /** @class */ (function () {
        function TileUtil() {
        }
        TileUtil.getTileByPos = function (point) {
            return new pixi_js_2.Point(Math.floor(point.x / TileUtil.tileSize), Math.floor(point.y / TileUtil.tileSize));
        };
        TileUtil.isNeighbor = function (tile, neighbor) {
            if (Math.abs(tile.x - neighbor.x) > 1 || Math.abs(tile.y - neighbor.y) > 1)
                return false;
            return true;
        };
        return TileUtil;
    }());
    exports.TileUtil = TileUtil;
});
define("com/coolgames/components/display/tileDisplayComponent", ["require", "exports", "com/coolgames/components/display/displayComponent", "com/coolgames/utils/tileUtil"], function (require, exports, displayComponent_1, tileUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TileDisplayComponent = /** @class */ (function (_super) {
        __extends(TileDisplayComponent, _super);
        function TileDisplayComponent(content) {
            return _super.call(this, content) || this;
        }
        TileDisplayComponent.prototype.position = function (x, y) {
            this._x = x;
            this._y = y;
            this._content.x = x * tileUtil_1.TileUtil.tileSize;
            this._content.y = y * tileUtil_1.TileUtil.tileSize;
        };
        return TileDisplayComponent;
    }(displayComponent_1.DisplayComponent));
    exports.TileDisplayComponent = TileDisplayComponent;
});
define("com/coolgames/factories/display/tileDisplayComponentFactory", ["require", "exports", "com/coolgames/pool/pool", "com/coolgames/components/display/tileDisplayComponent", "game", "com/coolgames/components/map/gameObject"], function (require, exports, pool_2, tileDisplayComponent_1, game_2, gameObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TileDisplayComponentFactory = /** @class */ (function () {
        function TileDisplayComponentFactory() {
        }
        TileDisplayComponentFactory.prototype.createImages = function (numImages) {
            for (var i = 0; i < numImages; i++) {
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.EMPTY)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NORMAL)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.FLAG)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.BOMB)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.BOMB_EXPLODED)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.QUESTIONMARK)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.QUESTIONMARK_PRESSED)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_1)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_2)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_3)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_4)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_5)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_6)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_7)));
                pool_2.Pool.instance.addReusable(new tileDisplayComponent_1.TileDisplayComponent(game_2.Game.instance.imageFactory.getImage("tile_" + gameObject_1.GameObject.NUM_8)));
            }
        };
        TileDisplayComponentFactory.prototype.get = function (imageId) {
            var diplayComponent = pool_2.Pool.instance.acquire(imageId);
            if (diplayComponent == null) {
                var image = game_2.Game.instance.imageFactory.getImage(imageId);
                diplayComponent = new tileDisplayComponent_1.TileDisplayComponent(image);
            }
            return diplayComponent;
        };
        return TileDisplayComponentFactory;
    }());
    exports.TileDisplayComponentFactory = TileDisplayComponentFactory;
});
define("com/coolgames/events/loadEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadEvent = /** @class */ (function () {
        function LoadEvent() {
        }
        LoadEvent.LOAD_COMPLETE = "loadComplete";
        return LoadEvent;
    }());
    exports.LoadEvent = LoadEvent;
});
define("com/coolgames/screens/level", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Level = /** @class */ (function () {
        function Level(levelId, mapWidth, mapHeight, numBombs, bombsPosition) {
            this.levelId = levelId;
            this.mapWidth = mapWidth;
            this.mapHeight = mapHeight;
            this.numBombs = numBombs;
            this.bombsPosition = bombsPosition;
        }
        return Level;
    }());
    exports.Level = Level;
});
define("com/coolgames/components/render/Renderable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("com/coolgames/components/render/spriteRenderComponent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpriteRenderComponent = /** @class */ (function () {
        function SpriteRenderComponent(renderable) {
            this._renderable = renderable;
            this._canvas = renderable.getCanvas();
        }
        SpriteRenderComponent.prototype.update = function () {
            var numChildren = this._canvas.children.length;
            if (numChildren > 0) {
                this._canvas.removeChildren(0, numChildren);
            }
            var objects = this._renderable.getObjects();
            var length = objects.length;
            for (var i = 0; i < length; i++) {
                this._canvas.addChild(objects[i].display.content);
            }
        };
        return SpriteRenderComponent;
    }());
    exports.SpriteRenderComponent = SpriteRenderComponent;
});
define("com/coolgames/components/map/map", ["require", "exports", "com/coolgames/components/map/tile", "com/coolgames/components/render/spriteRenderComponent", "com/coolgames/pool/pool"], function (require, exports, tile_1, spriteRenderComponent_1, pool_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Map = /** @class */ (function () {
        function Map(tileSize, canvas) {
            this._tileSize = tileSize;
            this._canvas = canvas;
        }
        Object.defineProperty(Map.prototype, "tiles", {
            get: function () {
                return this._tiles;
            },
            enumerable: true,
            configurable: true
        });
        Map.prototype.start = function (level) {
            this._level = level;
            this.createTiles();
            this.createRender();
            this.createObjectList();
        };
        Map.prototype.add = function (object) {
            this._mapChanged = true;
            var index = object.display.y * this._level.mapWidth + object.display.x;
            if (index <= this._tiles.length - 1) {
                var tile = this._tiles[index];
                if (!tile.isBusy()) {
                    tile.object = object;
                    return;
                }
            }
        };
        Map.prototype.remove = function (element, tile) {
            var length = this._tiles.length;
            this._mapChanged = true;
            for (var i = 0; i < length; i++) {
                if (this._tiles[i].object == element) {
                    this._tiles[i].clear();
                    return;
                }
            }
        };
        Map.prototype.getTile = function (x, y) {
            var index = y * this._level.mapWidth + x;
            if (index <= this._tiles.length - 1) {
                return this._tiles[index];
            }
            return null;
        };
        Map.prototype.getNeighbors = function (tile) {
            var neighbors = new Array();
            var startX = tile.x - 1;
            var startY = tile.y - 1;
            var endX = tile.x + 1;
            var endY = tile.y + 1;
            if (startX < 0)
                startX = tile.x;
            if (startY < 0)
                startY = tile.y;
            if (endX > this._level.mapWidth - 1)
                endX = tile.x;
            if (endY > this._level.mapHeight - 1)
                endY = tile.y;
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var currentTile = this.getTile(i, j);
                    if (currentTile != tile) {
                        neighbors.push(currentTile);
                    }
                }
            }
            return neighbors;
        };
        Map.prototype.update = function () {
            if (this._mapChanged) {
                this._mapChanged = false;
                this.createObjectList();
            }
            this._render.update();
        };
        Map.prototype.getCanvas = function () {
            return this._canvas;
        };
        Map.prototype.getObjects = function () {
            return this._objectList;
        };
        Map.prototype.clear = function () {
            this._canvas = null;
            this._level = null;
            this._tiles = null;
            for (var i = 0; i < this._objectList.length; i++) {
                this._objectList[i].display.clear();
                pool_3.Pool.instance.release(this._objectList[i].display);
                this._objectList[i].clear();
            }
            this._objectList = null;
        };
        Map.prototype.createTiles = function () {
            var width = this._level.mapWidth;
            var height = this._level.mapHeight;
            this._tiles = new Array();
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    this._tiles.push(new tile_1.Tile(j, i));
                }
            }
        };
        Map.prototype.createRender = function () {
            this._render = new spriteRenderComponent_1.SpriteRenderComponent(this);
        };
        Map.prototype.createObjectList = function () {
            this._objectList = new Array();
            var length = this._tiles.length;
            for (var i = 0; i < length; i++) {
                if (this._tiles[i].object != null) {
                    this._objectList.push(this._tiles[i].object);
                }
            }
        };
        return Map;
    }());
    exports.Map = Map;
});
define("com/coolgames/screens/map/mapController", ["require", "exports", "com/coolgames/components/map/map", "com/coolgames/components/map/gameObject", "com/coolgames/utils/tileUtil"], function (require, exports, map_1, gameObject_2, tileUtil_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapController = /** @class */ (function (_super) {
        __extends(MapController, _super);
        function MapController(level) {
            var _this = _super.call(this) || this;
            _this._level = level;
            return _this;
        }
        Object.defineProperty(MapController.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapController.prototype, "isGameOver", {
            get: function () {
                return this._isGameOver;
            },
            enumerable: true,
            configurable: true
        });
        MapController.prototype.reset = function (level) {
            this._isGameOver = false;
            if (level != null) {
                this._level = level;
            }
            this._map.clear();
        };
        MapController.prototype.update = function () {
            this._map.update();
        };
        MapController.prototype.createMap = function (canvas) {
            this._map = new map_1.Map(tileUtil_2.TileUtil.tileSize, canvas);
            this._map.start(this._level);
            this.createBombs();
            this.createEmpties();
            this.defineNeighbors();
        };
        MapController.prototype.showObject = function (go) {
            if (go.type == gameObject_2.GameObject.BOMB) {
                go.state = gameObject_2.GameObject.BOMB_EXPLODED;
                go.type = gameObject_2.GameObject.BOMB_EXPLODED;
                this.gameExploded();
            }
            else if (go.type == gameObject_2.GameObject.EMPTY) {
                this.showEmptyNeighbors(go);
                this.verifyGameOver();
            }
            else {
                go.state = go.type;
                this.verifyGameOver();
            }
        };
        MapController.prototype.flag = function (go) {
            if (go.state == gameObject_2.GameObject.FLAG) {
                go.state = gameObject_2.GameObject.NORMAL;
            }
            else {
                go.state = gameObject_2.GameObject.FLAG;
            }
        };
        MapController.prototype.verifyGameOver = function () {
            var objects = this._map.getObjects();
            var countReveledTiles = 0;
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].type == objects[i].state) {
                    countReveledTiles++;
                }
            }
            var totalTiles = this._level.mapWidth * this._level.mapHeight;
            var numBombs = this._level.numBombs;
            if (totalTiles - countReveledTiles == numBombs) {
                this.gameOver();
            }
        };
        MapController.prototype.gameOver = function () {
            this._isGameOver = true;
            this.emit(GameEvent.GAME_OVER);
        };
        MapController.prototype.gameExploded = function () {
            this._isGameOver = true;
            this.revealMap();
            this.emit(GameEvent.EXPLODED);
        };
        MapController.prototype.createBombs = function () {
            var numBombs = 0;
            for (var i = 0; i < this._level.bombsPosition.length; i++) {
                var pos = this._level.bombsPosition[i];
                var go = new gameObject_2.GameObject(gameObject_2.GameObject.BOMB);
                go.display.position(pos.x, pos.y);
                this._map.add(go);
                numBombs++;
            }
            while (numBombs < this._level.numBombs) {
                var x = Math.floor(Math.random() * this._level.mapWidth);
                var y = Math.floor(Math.random() * this._level.mapHeight);
                if (!this._map.getTile(x, y).isBusy()) {
                    var go = new gameObject_2.GameObject(gameObject_2.GameObject.BOMB);
                    go.display.position(x, y);
                    this._map.add(go);
                    numBombs++;
                }
            }
        };
        MapController.prototype.createEmpties = function () {
            var width = this._level.mapWidth;
            var height = this._level.mapHeight;
            var go;
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    go = new gameObject_2.GameObject(gameObject_2.GameObject.EMPTY);
                    go.display.position(j, i);
                    this._map.add(go);
                }
            }
        };
        MapController.prototype.defineNeighbors = function () {
            var tile;
            var tiles;
            var numBombs;
            for (var i = 0; i < this._map.tiles.length; i++) {
                tile = this._map.tiles[i];
                if (tile.object.type != gameObject_2.GameObject.BOMB) {
                    numBombs = 0;
                    tiles = this._map.getNeighbors(tile);
                    for (var j = 0; j < tiles.length; j++) {
                        if (tiles[j].object.type == gameObject_2.GameObject.BOMB) {
                            numBombs++;
                        }
                    }
                    if (numBombs > 0) {
                        tile.object.type = numBombs.toString();
                    }
                }
            }
        };
        MapController.prototype.revealMap = function () {
            var go;
            for (var i = 0; i < this._map.tiles.length; i++) {
                go = this._map.tiles[i].object;
                if (go.state == gameObject_2.GameObject.FLAG) {
                    if (go.type == gameObject_2.GameObject.BOMB) {
                        go.type = gameObject_2.GameObject.FLAG;
                    }
                    else {
                        go.type = gameObject_2.GameObject.BOMB_WRONG;
                    }
                }
                go.state = go.type;
            }
        };
        MapController.prototype.showEmptyNeighbors = function (go) {
            var goList = this.getPath(go, []);
            for (var i = 0; i < goList.length; i++) {
                goList[i].state = goList[i].type;
            }
        };
        MapController.prototype.getPath = function (go, objects) {
            var goNear;
            if (objects.indexOf(go) == -1) {
                objects.push(go);
            }
            for (var i = 0; i < this._map.tiles.length; i++) {
                if (tileUtil_2.TileUtil.isNeighbor(this._map.getTile(go.display.x, go.display.y), this._map.tiles[i])
                    && (this._map.tiles[i].object.state != gameObject_2.GameObject.FLAG)
                    && (this._map.tiles[i].object.type != gameObject_2.GameObject.BOMB)
                    && objects.indexOf(this._map.tiles[i].object) == -1) {
                    goNear = this._map.tiles[i].object;
                    objects.push(goNear);
                    if (goNear.type == gameObject_2.GameObject.EMPTY) {
                        this.getPath(goNear, objects);
                    }
                }
            }
            return objects;
        };
        return MapController;
    }(PIXI.utils.EventEmitter));
    exports.MapController = MapController;
});
define("com/coolgames/screens/main/mainController", ["require", "exports", "game", "com/coolgames/events/loadEvent", "com/coolgames/screens/level"], function (require, exports, game_3, loadEvent_1, level_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainController = /** @class */ (function (_super) {
        __extends(MainController, _super);
        function MainController() {
            var _this = _super.call(this) || this;
            var loader = new PIXI.loaders.Loader();
            loader.add("sprites", "./assets/sprites.json");
            loader.add("levels", "./assets/levels.json", { "aeee": _this });
            loader.load(_this.onFilesLoad.bind(_this));
            return _this;
        }
        MainController.prototype.startLevel = function (levelId) {
            this._activeLevel = this._levels[levelId - 1];
        };
        MainController.prototype.nextLevel = function () {
            if (this._activeLevel.levelId + 1 <= this._levels.length) {
                this._activeLevel = this._levels[this._activeLevel.levelId];
            }
        };
        Object.defineProperty(MainController.prototype, "activeLevel", {
            get: function () {
                return this._activeLevel;
            },
            enumerable: true,
            configurable: true
        });
        MainController.prototype.onFilesLoad = function (loader, resources) {
            this.setup(resources.levels.data);
            this.emit(loadEvent_1.LoadEvent.LOAD_COMPLETE);
        };
        MainController.prototype.setup = function (levels) {
            this.createLevels(levels);
            game_3.Game.instance.displayFactory.createImages(this._activeLevel.mapWidth * this._activeLevel.mapHeight);
        };
        MainController.prototype.createLevels = function (levels) {
            this._levels = new Array();
            for (var i = 0; i < levels.length; i++) {
                this._levels.push(new level_1.Level(levels[i].levelId, levels[i].mapWidth, levels[i].mapHeight, levels[i].numBombs, levels[i].bombsPosition));
            }
            this._activeLevel = this._levels[0];
        };
        return MainController;
    }(PIXI.utils.EventEmitter));
    exports.MainController = MainController;
});
define("com/coolgames/screens/map/mapView", ["require", "exports", "pixi.js", "com/coolgames/utils/tileUtil", "com/coolgames/components/map/gameObject"], function (require, exports, pixi_js_3, tileUtil_3, gameObject_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapView = /** @class */ (function (_super) {
        __extends(MapView, _super);
        function MapView(mapController) {
            var _this = _super.call(this) || this;
            _this.interactive = true;
            _this._mapController = mapController;
            return _this;
        }
        MapView.prototype.show = function () {
            this.addEvents();
        };
        MapView.prototype.hide = function () {
        };
        MapView.prototype.update = function () {
            if (this._isMouseDown) {
                var tilePos = tileUtil_3.TileUtil.getTileByPos(this._mousePosition);
                var tile = this._mapController.map.getTile(tilePos.x, tilePos.y);
                if (tile != null) {
                    var go = tile.object;
                    if (go.state == gameObject_3.GameObject.NORMAL && this._activeGameObject != go) {
                        if (this._activeGameObject != null) {
                            this._activeGameObject.state = gameObject_3.GameObject.NORMAL;
                        }
                        this._activeGameObject = go;
                        this._activeGameObject.state = gameObject_3.GameObject.EMPTY;
                    }
                }
            }
            else {
                if (this._activeGameObject != null) {
                    if (this._activeGameObject.state == gameObject_3.GameObject.EMPTY) {
                        this._mapController.showObject(this._activeGameObject);
                    }
                    this._activeGameObject = null;
                }
            }
            this._mapController.update();
        };
        MapView.prototype.addEvents = function () {
            this.on("mouseupoutside", this.onMouseUp.bind(this));
            this.on("mouseup", this.onMouseUp.bind(this));
            this.on("pointerdown", this.onMouseDown.bind(this));
            this.on("mousemove", this.onMouseMove.bind(this));
        };
        MapView.prototype.onMouseDown = function (e) {
            if (this._mapController.isGameOver) {
                return;
            }
            if (e.data.button == 0) {
                this._isMouseDown = true;
            }
            else if (e.data.button == 2) {
                var tilePos = tileUtil_3.TileUtil.getTileByPos(this._mousePosition);
                var tile = this._mapController.map.getTile(tilePos.x, tilePos.y);
                if (tile != null && (tile.object.state == gameObject_3.GameObject.NORMAL || tile.object.state == gameObject_3.GameObject.FLAG)) {
                    this._mapController.flag(tile.object);
                }
            }
        };
        MapView.prototype.onMouseUp = function (e) {
            if (this._mapController.isGameOver) {
                return;
            }
            if (e.data.button == 0) {
                this._isMouseDown = false;
            }
        };
        MapView.prototype.onMouseMove = function (e) {
            if (this._mapController.isGameOver) {
                return;
            }
            this._mousePosition = e.data.getLocalPosition(this);
        };
        return MapView;
    }(pixi_js_3.Sprite));
    exports.MapView = MapView;
});
define("com/coolgames/screens/main/smileButton", ["require", "exports", "pixi.js", "game"], function (require, exports, pixi_js_4, game_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SmileButton = /** @class */ (function (_super) {
        __extends(SmileButton, _super);
        function SmileButton() {
            var _this = _super.call(this) || this;
            _this.interactive = true;
            _this._smile = game_4.Game.instance.imageFactory.getImage("smile");
            _this._smilePressed = game_4.Game.instance.imageFactory.getImage("smile_pressed");
            _this._smileGameOver = game_4.Game.instance.imageFactory.getImage("smile_game_over");
            _this._smileExploded = game_4.Game.instance.imageFactory.getImage("smile_exploded");
            _this._smileFear = game_4.Game.instance.imageFactory.getImage("smile_fear");
            _this._smilePressed.visible = false;
            _this._smileGameOver.visible = false;
            _this._smileExploded.visible = false;
            _this._smileFear.visible = false;
            _this.addChild(_this._smile);
            _this.addChild(_this._smilePressed);
            _this.addChild(_this._smileGameOver);
            _this.addChild(_this._smileExploded);
            _this.addChild(_this._smileFear);
            _this.on("mousedown", _this.onMouseDown.bind(_this));
            _this.on("mouseup", _this.onMouseUp.bind(_this));
            _this.on("mouseupoutside", _this.onMouseUpOutside.bind(_this));
            return _this;
        }
        SmileButton.prototype.normal = function () {
            this._smile.visible = true;
            this._smileFear.visible = false;
            this._smilePressed.visible = false;
            this._smileExploded.visible = false;
            this._smileGameOver.visible = false;
        };
        SmileButton.prototype.fear = function () {
            this._smileFear.visible = true;
            this._smile.visible = false;
            this._smilePressed.visible = false;
            this._smileExploded.visible = false;
            this._smileGameOver.visible = false;
        };
        SmileButton.prototype.exploded = function () {
            this._smileExploded.visible = true;
            this._smile.visible = false;
            this._smilePressed.visible = false;
            this._smileGameOver.visible = false;
            this._smileFear.visible = false;
        };
        SmileButton.prototype.gameOver = function () {
            this._smileGameOver.visible = true;
            this._smile.visible = false;
            this._smilePressed.visible = false;
            this._smileExploded.visible = false;
            this._smileFear.visible = false;
        };
        SmileButton.prototype.onMouseDown = function () {
            this._smilePressed.visible = true;
            this._smile.visible = false;
            this._smileGameOver.visible = false;
            this._smileExploded.visible = false;
            this._smileFear.visible = false;
        };
        SmileButton.prototype.onMouseUp = function () {
            this._smile.visible = true;
            this._smilePressed.visible = false;
            this._smileGameOver.visible = false;
            this._smileExploded.visible = false;
            this._smileFear.visible = false;
            this.emit(GameEvent.RESET);
        };
        SmileButton.prototype.onMouseUpOutside = function () {
            this._smile.visible = true;
            this._smilePressed.visible = false;
        };
        return SmileButton;
    }(pixi_js_4.Sprite));
    exports.SmileButton = SmileButton;
});
define("com/coolgames/screens/main/mainView", ["require", "exports", "pixi.js", "com/coolgames/screens/map/mapController", "com/coolgames/screens/map/mapView", "game", "com/coolgames/utils/tileUtil", "com/coolgames/screens/main/smileButton"], function (require, exports, pixi_js_5, mapController_1, mapView_1, game_5, tileUtil_4, smileButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainView = /** @class */ (function () {
        function MainView(mainController, container) {
            this._mainController = mainController;
            this._container = container;
        }
        MainView.prototype.show = function () {
            this.createMapScreen();
            this.createInterface();
            this.resizeCanvas();
            this.showMessage("Level:" + this._mainController.activeLevel.levelId);
        };
        MainView.prototype.hide = function () {
        };
        MainView.prototype.resizeCanvas = function () {
            game_5.Game.instance.app.view.width = this._mainController.activeLevel.mapWidth * tileUtil_4.TileUtil.tileSize;
            game_5.Game.instance.app.view.height = this._mainController.activeLevel.mapHeight * tileUtil_4.TileUtil.tileSize + 50;
            this._smileButton.x = (game_5.Game.instance.app.view.width / 2) - 13;
        };
        MainView.prototype.createMapScreen = function () {
            this._mapController = new mapController_1.MapController(this._mainController.activeLevel);
            this._mapView = new mapView_1.MapView(this._mapController);
            this._container.addChild(this._mapView);
            this._mapView.y = 50;
            this._mapController.createMap(this._mapView);
            this._mapController.on(GameEvent.GAME_OVER, this.onGameOver.bind(this));
            this._mapController.on(GameEvent.EXPLODED, this.onGameExploded.bind(this));
            this._mapView.show();
            this._mapView.on("mousedown", this.onMapMouseDown.bind(this));
            this._mapView.on("mouseup", this.onMapMouseUp.bind(this));
            this._mapView.on("mouseupoutside", this.onMapMouseUp.bind(this));
            game_5.Game.instance.app.ticker.add(this.update.bind(this));
        };
        MainView.prototype.update = function () {
            this._mapView.update();
        };
        MainView.prototype.createInterface = function () {
            this._smileButton = new smileButton_1.SmileButton();
            this._smileButton.y = 12;
            this._container.addChild(this._smileButton);
            this._smileButton.on(GameEvent.RESET, this.onResetGameClick.bind(this));
        };
        MainView.prototype.onGameExploded = function () {
            this._smileButton.exploded();
        };
        MainView.prototype.onGameOver = function () {
            this._smileButton.gameOver();
            setTimeout(this.startNextLevel.bind(this), 2000);
        };
        MainView.prototype.startNextLevel = function () {
            game_5.Game.instance.app.ticker.remove(this.update.bind(this));
            this._mainController.nextLevel();
            this._mapController.reset();
            this._container.removeChild(this._mapView);
            this.createMapScreen();
            this.resizeCanvas();
            this._smileButton.normal();
            this.showMessage("Level: " + this._mainController.activeLevel.levelId);
        };
        MainView.prototype.onResetGameClick = function () {
            this._mapController.reset();
            this._mapController.createMap(this._mapView);
        };
        MainView.prototype.onMapMouseDown = function (e) {
            if (e.data.button == 0 && !this._mapController.isGameOver) {
                this._smileButton.fear();
            }
        };
        MainView.prototype.onMapMouseUp = function (e) {
            if (!this._mapController.isGameOver) {
                this._smileButton.normal();
            }
        };
        MainView.prototype.showMessage = function (text) {
            if (this._text == null) {
                var style = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: 12,
                });
                this._text = new pixi_js_5.Text(text, style);
                this._container.addChild(this._text);
                this._text.x = 5;
                this._text.y = 5;
            }
            this._text.text = text;
        };
        return MainView;
    }());
    exports.MainView = MainView;
});
define("game", ["require", "exports", "com/coolgames/factories/imageFactory", "pixi.js", "com/coolgames/factories/display/tileDisplayComponentFactory", "com/coolgames/screens/main/mainController", "com/coolgames/screens/main/mainView", "com/coolgames/events/loadEvent", "com/coolgames/utils/tileUtil"], function (require, exports, imageFactory_1, pixi_js_6, tileDisplayComponentFactory_1, mainController_1, mainView_1, loadEvent_2, tileUtil_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function () {
        function Game() {
        }
        Object.defineProperty(Game, "instance", {
            get: function () {
                return Game._instance || (Game._instance = new Game());
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.init = function () {
            tileUtil_5.TileUtil.tileSize = 16;
            this._diplayFactory = new tileDisplayComponentFactory_1.TileDisplayComponentFactory();
            this._imageFactory = new imageFactory_1.ImageFactory();
            this.setupPIXI();
            this.createMainScreen();
        };
        Object.defineProperty(Game.prototype, "displayFactory", {
            get: function () {
                return this._diplayFactory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "imageFactory", {
            get: function () {
                return this._imageFactory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "app", {
            get: function () {
                return this._app;
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.setupPIXI = function () {
            this._app = new pixi_js_6.Application({
                width: 256,
                height: 256,
                antialias: true,
                transparent: false,
                resolution: 1,
                forceCanvas: true,
                backgroundColor: 0xbdbdbd
            });
            document.body.appendChild(this._app.view);
            this._app.view.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
        };
        Game.prototype.createMainScreen = function () {
            var canvas = new pixi_js_6.Sprite();
            this._app.stage.addChild(canvas);
            var mainController = new mainController_1.MainController();
            mainController.on(loadEvent_2.LoadEvent.LOAD_COMPLETE, this.onLoadComplete);
            this._mainView = new mainView_1.MainView(mainController, canvas);
        };
        Game.prototype.onLoadComplete = function () {
            Game.instance._mainView.show();
        };
        return Game;
    }());
    exports.Game = Game;
});
requirejs.config({
    map: {
        '*': {
            'pixi.js': '../lib/pixi'
        }
    }
});
requirejs(['pixi.js', 'game'], function (pixi, game) {
    game.Game.instance.init();
});
var GameEvent = /** @class */ (function () {
    function GameEvent() {
    }
    GameEvent.RESET = "reset";
    GameEvent.GAME_OVER = "gameOver";
    GameEvent.EXPLODED = "exploded";
    return GameEvent;
}());
define("com/coolgames/factories/gameObjectFactory", ["require", "exports", "com/coolgames/components/map/gameObject"], function (require, exports, gameObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameObjectFactory = /** @class */ (function () {
        function GameObjectFactory() {
        }
        GameObjectFactory.createGameObject = function (type) {
            var go = new gameObject_4.GameObject(type);
            return go;
        };
        return GameObjectFactory;
    }());
});
//# sourceMappingURL=main.js.map