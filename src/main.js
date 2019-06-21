import engine from './engine';
import scenes from './scenes';

window.onload = () => {
    
    const game = new engine.Game(800, 512);

    game.addScene('gameload', new scenes.GameLoad());

    game.addScene('gamemenu', new scenes.GameMenu());

    game.addScene('gameplay', new scenes.GamePlay());

    game.addScene('gameover', new scenes.GameOver());

    game.run('gameload');
};