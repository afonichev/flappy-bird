import { Scene, Screen, Game } from '../../engine';
import helper from '../../helper';

export default class GameMenu extends Scene {

    /**
     * Конструктор сцены меню.
     */
    constructor() {

        super();

        this.store = {

            last: 0,

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

            message: {

                /** @type { (HTMLImageElement|null) } */
                sprite: null
            },

            bird: {

                offset: 0,

                direction: 1,

                frequency: 0,

                index: 0,

                position: {

                    x: 0,

                    y: 0
                },

                /** @type { Array<HTMLImageElement>) } */
                sprites: []
            },

            audio: {

                /** @type { (string|null) } */
                wing: null
            }
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

        store.background.sprite = game.resources[helper.randomArray(['imageBackgroundDay', 'imageBackgroundNight'])];

        store.base.sprite = game.resources['imageBase'];

        store.message.sprite = game.resources['imageMessage'];

        const bird = helper.randomArray([
            {
                up: 'imageBlueBirdUpFlap',
                middle: 'imageBlueBirdMidFlap',
                down: 'imageBlueBirdDownFlap'
            },
            {
                up: 'imageRedBirdUpFlap',
                middle: 'imageRedBirdMidFlap',
                down: 'imageRedBirdDownFlap'
            },
            {
                up: 'imageYellowBirdUpFlap',
                middle: 'imageYellowBirdMidFlap',
                down: 'imageYellowBirdDownFlap'
            }
        ]);

        store.bird.sprites = []

        store.bird.sprites.push(game.resources[bird.up]);

        store.bird.sprites.push(game.resources[bird.middle]);

        store.bird.sprites.push(game.resources[bird.down]);

        store.audio.wing = game.resources['audioWing'];

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

                        new Audio(store.audio.wing).play();

                        this.switchScene('gameplay', {

                            background: {

                                offset: store.background.offset,

                                sprite: store.background.sprite
                            },
                            
                            base: {

                                offset: store.base.offset,

                                sprite: store.base.sprite
                            }, 

                            bird: {

                                frequency: store.bird.frequency,
                                
                                index: store.bird.index,

                                position: store.bird.position,

                                sprites: store.bird.sprites
                            }
                        });

                        break;
                }
            }

            // обработка событий мыши
            if (game.mousedownEvent != null) {

                const event = game.mousedownEvent;

                switch (event.button) {

                    case 0: // левая кнопка мыши

                        new Audio(store.audio.wing).play();

                        this.switchScene('gameplay', {

                            background: {

                                offset: store.background.offset,

                                sprite: store.background.sprite
                            },
                            
                            base: {

                                offset: store.base.offset,

                                sprite: store.base.sprite
                            }, 

                            bird: {

                                frequency: store.bird.frequency,

                                index: store.bird.index,

                                position: store.bird.position,

                                sprites: store.bird.sprites
                            }
                        });

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

                    context.save();

                    // фон

                    store.background.offset = -((-store.background.offset + 1) % store.background.sprite.width);

                    context.translate(store.background.offset, 0);

                    const backgroundCount = Math.ceil(screen.width / store.background.sprite.width) + 1;

                    for(let i = 0; i <= backgroundCount; i++) {

                        context.drawImage(store.background.sprite, (i * store.background.sprite.width), 0);
                    }

                    // земля

                    store.base.offset = -((-store.base.offset + 4) % store.base.sprite.width);

                    context.translate(store.base.offset, 0);

                    const baseCount = Math.ceil(screen.width / store.base.sprite.width) + 1;

                    for(let i = 0; i <= baseCount; i++) {

                        context.drawImage(store.base.sprite, (i * store.base.sprite.width), (screen.height - store.base.sprite.height));
                    }

                    context.restore();
                    
                    // приветствие

                    context.drawImage(store.message.sprite, Math.floor((screen.width - store.message.sprite.width) / 2), Math.floor(((screen.height - store.base.sprite.height) - store.message.sprite.height) / 2));

                    // персонаж

                    if (Math.abs(store.bird.offset) == 8) {
                        
                        store.bird.direction *= -1
                    }

                    store.bird.offset = (store.bird.direction == 1) ? (store.bird.offset + 1) : (store.bird.offset - 1);

                    if (((store.bird.frequency + 1) % 4) == 0) {
                        
                        store.bird.frequency = 0;
                        
                        store.bird.index++;
                        
                        if (store.bird.index >= store.bird.sprites.length) {
                        
                            store.bird.index = 0;
                        }
                    }
                    
                    store.bird.frequency++

                    /** @type { HTMLImageElement } */
                    const character = store.bird.sprites[store.bird.index];

                    store.bird.position.x = Math.floor(screen.width * 0.2),

                    store.bird.position.y = Math.floor((screen.height - character.height) / 2) + store.bird.offset;

                    context.drawImage(character, store.bird.position.x, store.bird.position.y);
                }
            }
        }

        super.render(time);
    } 
};