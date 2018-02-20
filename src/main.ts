
requirejs.config({
    map: {
      '*': {
        'pixi.js': '../lib/pixi'
      }  
    }
});

requirejs(['pixi.js','game'], (pixi:any, game:any) => {
    game.Game.instance.init();
});