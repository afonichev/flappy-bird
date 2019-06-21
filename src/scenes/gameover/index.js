import { Scene, Screen, Game } from '../../engine';

export default class GameOver extends Scene {

    /**
     * Конструктор сцены меню.
     */
    constructor() {

        super();

        this.store = {

            last: 0,

            score: {

                offset: 0,

                value: 0,

                /** @type { Array<HTMLImageElement>) } */
                sprites: []
            },

            background: {

                offset: 0,

                /** @type { (HTMLImageElement|null) } */
                sprite: null
            }, 

            base: {

                offset: 0,

                /** @type { (HTMLImageElement|null) } */
                sprite: null
            },

            over: {

                /** @type { (HTMLImageElement|null) } */
                sprite: null
            },

            bird: {

                rotation: 0,

                index: 0,

                position: {

                    x: 0,

                    y: 0
                },

                /** @type { Array<HTMLImageElement> } */
                sprites: []
            },

            /** @type { Array<{ top: { x: number, y: number, rect: { left: number, top: number, right: number, bottom: number }, sprite: HTMLImageElement }, bottom: { x: number, y: number, rect: { left: number, top: number, right: number, bottom: number }, sprite: HTMLImageElement } }>) } */
            pipes: []
        };
    }

    /**
     * Прелоадер сцены меню.
     * 
     * @param { Game } game Класс игры.
     * @param { object } props Свойства сцены меню.
     */
    preloader(game, props) {

        const store = this.store;

        store.last = 0;

        store.score.sprites = [];

        store.bird.sprites = [];

        store.pipes = [];

        if (props != null) {

            Object.assign(store.score, props.score);

            Object.assign(store.background, props.background);

            Object.assign(store.base, props.base);

            Object.assign(store.bird, props.bird);

            Object.assign(store.pipes, props.pipes);

        } else {

            // error
        }

        store.over.sprite = game.resources['imageGameOver'];

        super.preloader(game, props);
    }

    /**
     * Рендер сцены меню.
     * 
     * @param { number } time Время запланированной анимации.
     */
    render(time) {

        const store = this.store;

        const game = this.game;

        if (game instanceof Game) {

            // обработка событий клавиатуры
            if (game.keydownEvent != null) {

                const event = game.keydownEvent;

                switch (event.keyCode) {

                    case 32: // пробел

                        this.switchScene('gamemenu');
                        break;
                }
            }

            // обработка событий мыши
            if (game.mousedownEvent != null) {

                const event = game.mousedownEvent;

                switch (event.button) {

                    case 0: // левая кнопка мыши

                        this.switchScene('gamemenu');
                        break;
                }
            }

            const screen = game.screen;

            if (screen instanceof Screen) {

                const context = screen.context;

                if ((time - store.last) > 30) {

                    store.last = time;

                    // заливка
                    
                    context.fillStyle = '#000000';
                    
                    context.fillRect(0, 0, screen.width, screen.height);

                    
                    
                    



                    // фон

                    context.save();

                    context.translate(store.background.offset, 0);

                    const backgroundCount = Math.ceil(screen.width / store.background.sprite.width) + 1;

                    for(let i = 0; i <= backgroundCount; i++) {

                        context.drawImage(store.background.sprite, (i * store.background.sprite.width), 0);
                    }

                    context.restore();

                    // трубы

                    for (let i = 0; i < store.pipes.length; i++) {

                        const pipe = store.pipes[i];

                        context.drawImage(pipe.top.sprite, pipe.top.x, pipe.top.y);

                        context.drawImage(pipe.bottom.sprite, pipe.bottom.x, pipe.bottom.y);
                    }

                    // земля

                    context.save();

                    context.translate(store.base.offset, 0);

                    const baseCount = Math.ceil(screen.width / store.base.sprite.width) + 1;

                    for(let i = 0; i <= baseCount; i++) {

                        context.drawImage(store.base.sprite, (i * store.base.sprite.width), (screen.height - store.base.sprite.height));
                    }

                    context.restore();

                    // персонаж

                    const character = store.bird.sprites[store.bird.index];

                    context.save();

                    context.translate(store.bird.position.x, store.bird.position.y + character.height);

                    context.rotate(store.bird.rotation * Math.PI / 180);
                    
                    context.drawImage(character, -character.width / 2, -character.height / 2);

                    context.restore();

                    // очки

                    const digits = store.score.value.toString().split('').map(x => parseInt(x));

                    let scoreTotalWidth = 0;

                    for(var i = 0; i < digits.length; i++) {
                            
                        const digit = digits[i];

                        scoreTotalWidth += store.score.sprites[digit].width;
                    }
                    
                    store.score.offset = Math.floor((screen.width - scoreTotalWidth) / 2);

                    for(var i = 0; i < digits.length; i++) {
                        
                        const digit = digits[i];

                        const scoreSprite = store.score.sprites[digit];

                        context.drawImage(scoreSprite, store.score.offset, 52);

                        store.score.offset += scoreSprite.width;
                    }

                    // конец игры

                    context.drawImage(store.over.sprite, (screen.width - store.over.sprite.width) / 2, (screen.height - store.over.sprite.height) / 2);
                }
            }
        }

        super.render(time);
    } 
};