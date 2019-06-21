import { Scene, Screen, Game } from '../../engine';
import helper from '../../helper';

export default class GamePlay extends Scene {

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

            bird: {

                die: false,

                velocityY: 0,

                maxVelocityY: 0,

                accelerationY: 0,

                rotation: 0,

                speed: 0,

                rotationThreshold: 0,

                accelerationFlap: 0,

                flapped: false,

                frequency: 0,

                index: 0,

                position: {

                    x: 0,

                    y: 0
                },

                rect: {

                    left: 0,

                    top: 0,

                    right: 0,

                    bottom: 0
                },

                /** @type { Array<HTMLImageElement> } */
                sprites: []
            },

            pipe: {

                window: 100,

                offset: 0,

                check: {

                    index: 0,

                    top: {

                        x: 0
                    },

                    bottom: {

                        x: 0
                    }
                },

                top: {

                    /** @type { HTMLImageElement|null } */
                    sprite: null
                },

                bottom: {

                    /** @type { HTMLImageElement|null } */
                    sprite: null
                }
            },

            /** @type { Array<{ top: { x: number, y: number, rect: { left: number, top: number, right: number, bottom: number }, sprite: HTMLImageElement }, bottom: { x: number, y: number, rect: { left: number, top: number, right: number, bottom: number }, sprite: HTMLImageElement } }>) } */
            pipes: [],

            audio: {

                /** @type { (string|null) } */
                die: null,

                /** @type { (string|null) } */
                hit: null,

                /** @type { (string|null) } */
                wing: null,

                /** @type { (string|null) } */
                point: null,
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

        const bird = store.bird;

        bird.die = false;

        bird.velocityY = -9;

        bird.maxVelocityY = 10;

        bird.accelerationY = 1;

        bird.rotation = 45;

        bird.speed = 3;

        bird.rotationThreshold = 45;

        bird.accelerationFlap = -9;

        bird.flapped = true;

        bird.sprites = [];

        if (props != null) {

            Object.assign(store.background, props.background);

            Object.assign(store.base, props.base);

            Object.assign(store.bird.frequency, props.bird.frequency);

            Object.assign(store.bird.index, props.bird.index);

            Object.assign(store.bird.position, props.bird.position);

            Object.assign(store.bird.sprites, props.bird.sprites);

        } else {

            // error
        }

        store.score.offset = 0;

        store.score.value = 0;

        store.score.sprites = [];

        store.score.sprites.push(game.resources['image0']);

        store.score.sprites.push(game.resources['image1']);

        store.score.sprites.push(game.resources['image2']);

        store.score.sprites.push(game.resources['image3']);

        store.score.sprites.push(game.resources['image4']);

        store.score.sprites.push(game.resources['image5']);

        store.score.sprites.push(game.resources['image6']);

        store.score.sprites.push(game.resources['image7']);

        store.score.sprites.push(game.resources['image8']);

        store.score.sprites.push(game.resources['image9']);


        const pipe = helper.randomArray([
            {
                top: 'imagePipeTopGreen',
                
                bottom: 'imagePipeBottomGreen'
            },
            {
                top: 'imagePipeTopRed',
                
                bottom: 'imagePipeBottomRed'
            }
        ]);

        store.pipes = [];

        store.pipe.check.index = 0;

        store.pipe.check.top.x = 0;

        store.pipe.check.bottom.x = 0;

        store.pipe.offset = helper.random(80, 120);

        store.pipe.top.sprite = game.resources[pipe.top];

        store.pipe.bottom.sprite = game.resources[pipe.bottom];


        store.audio.die = game.resources['audioDie'];

        store.audio.hit = game.resources['audioHit'];

        store.audio.wing = game.resources['audioWing'];

        store.audio.point = game.resources['audioPoint'];

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

                        if (store.bird.position.y > -2 * store.bird.sprites[store.bird.index].height && !store.bird.die) {
                            
                            store.bird.velocityY = store.bird.accelerationFlap;
                            
                            store.bird.flapped = true;

                            new Audio(store.audio.wing).play();
                        }

                        break;
                }
            }

            // обработка событий мыши
            if (game.mousedownEvent != null) {

                const event = game.mousedownEvent;

                switch (event.button) {

                    case 0: // левая кнопка мыши

                        if (store.bird.position.y > -2 * store.bird.sprites[store.bird.index].height && !store.bird.die) {
                            
                            store.bird.velocityY = store.bird.accelerationFlap;
                            
                            store.bird.flapped = true;

                            new Audio(store.audio.wing).play();
                        }

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

                    // проверка столкновений

                    if (store.pipes.length > 0 && !store.bird.die) {

                        if (store.pipe.check.index < store.pipes.length) {

                            const pipe = store.pipes[store.pipe.check.index];

                            if (screen.hitBox(store.bird.rect, pipe.top.rect) || screen.hitBox(store.bird.rect, pipe.bottom.rect)) {

                                store.bird.die = true;

                                new Audio(store.audio.hit).play();

                                new Audio(store.audio.die).play();
                            }
                        }
                    }

                    if ((store.bird.position.y + store.bird.sprites[store.bird.index].height) >= (screen.height - store.base.sprite.height)) {

                        if (!store.bird.die) {
                        
                            new Audio(store.audio.hit).play();
                        }

                        this.switchScene('gameover', {

                            score: {

                                offset: store.score.offset,
                
                                value: store.score.value,
                
                                sprites: store.score.sprites
                            },
                
                            background: {
                
                                offset: store.background.offset,
                
                                sprite: store.background.sprite
                            }, 
                
                            base: {
                
                                offset: store.base.offset,
                
                                sprite: store.base.sprite
                            },

                            bird: {

                                rotation: store.bird.rotation,

                                index: store.bird.index,

                                position: store.bird.position,

                                sprites: store.bird.sprites
                            },

                            pipes: store.pipes
                        });
                    }

                    // фон и земля

                    if (!store.bird.die) {

                        store.background.offset = -((-store.background.offset + 1) % store.background.sprite.width);

                        store.base.offset = -((-store.base.offset + 4) % store.base.sprite.width);
                    }

                    // трубы

                    if (store.pipes.length > 0 && !store.bird.die) {

                        if (store.pipe.check.index < store.pipes.length) {

                            const pipe = store.pipes[store.pipe.check.index];

                            store.pipe.check.top.x = pipe.top.x + pipe.top.sprite.width;

                            store.pipe.check.bottom.x = pipe.bottom.x + pipe.bottom.sprite.width;

                            if (store.bird.position.x > store.pipe.check.top.x && store.bird.position.x > store.pipe.check.bottom.x) {

                                new Audio(store.audio.point).play();

                                store.score.value++;

                                store.pipe.check.index++;
                            }
                        }
                        
                        store.pipes = store.pipes.filter(x => {
                            
                            const pipeTop = x.top;

                            const pipeBottom = x.bottom;

                            if (pipeTop.x < -pipeTop.sprite.width && pipeBottom.x < -pipeBottom.sprite.width) {

                                if (store.pipe.check.index > 0) {
                                
                                    store.pipe.check.index--;
                                }

                                return false;
                            }

                            return true;
                        });
                    }

                    if (!store.bird.die) {

                        for (let i = 0; i < store.pipes.length; i++) {

                            store.pipes[i].top.x -= 4;

                            store.pipes[i].bottom.x -= 4;

                            const tx = store.pipes[i].top.x;

                            const bx = store.pipes[i].bottom.x;

                            const tw = store.pipes[i].top.sprite.width;

                            const bw = store.pipes[i].bottom.sprite.width;

                            store.pipes[i].top.rect.left = tx;

                            store.pipes[i].top.rect.right = tx + tw;

                            store.pipes[i].bottom.rect.left = bx;

                            store.pipes[i].bottom.rect.right = bx + bw;
                        }

                        if (store.pipes.length > 0) {

                            if (store.pipe.offset <= 0) {

                                store.pipe.offset = helper.random(80, 120);


                                const pipeTopX = screen.width + store.pipe.top.sprite.width;

                                const pipeBottomX = screen.width + store.pipe.bottom.sprite.width;

                                const middle = ((screen.height - store.base.sprite.height) / 2);

                                const max = ((screen.height - store.base.sprite.height) - store.pipe.window) / 3;

                                const offset = helper.random(-max, max);

                                const tx = pipeTopX;

                                const ty = (-(store.pipe.top.sprite.height) + (middle - (store.pipe.window / 2) - offset));

                                const bx = pipeBottomX;

                                const by = (middle + (store.pipe.window / 2)) - offset;

                                store.pipes.push({

                                    top: {

                                        x: tx,

                                        y: ty,

                                        rect: {

                                            left: tx,

                                            top: ty,

                                            right: tx + store.pipe.top.sprite.width,

                                            bottom: ty + store.pipe.top.sprite.height
                                        },

                                        sprite: store.pipe.top.sprite
                                    },

                                    bottom: {

                                        x: bx,

                                        y: by,

                                        rect: {

                                            left: bx,

                                            top: by,

                                            right: bx + store.pipe.bottom.sprite.width,

                                            bottom: by + store.pipe.bottom.sprite.height
                                        },

                                        sprite: store.pipe.bottom.sprite
                                    }
                                });
                            }

                            store.pipe.offset--;
                        
                        } else {
                        
                            const pipeTopX = screen.width + store.pipe.top.sprite.width;

                            const pipeBottomX = screen.width + store.pipe.bottom.sprite.width;

                            const middle = ((screen.height - store.base.sprite.height) / 2);

                            const max = ((screen.height - store.base.sprite.height) - store.pipe.window) / 3;

                            const offset = helper.random(-max, max);

                            const tx = pipeTopX;

                            const ty = (-(store.pipe.top.sprite.height) + (middle - (store.pipe.window / 2) - offset));

                            const bx = pipeBottomX;

                            const by = (middle + (store.pipe.window / 2)) - offset;

                            store.pipes.push({

                                top: {

                                    x: tx,

                                    y: ty,

                                    rect: {

                                        left: tx,

                                        top: ty,

                                        right: tx + store.pipe.top.sprite.width,

                                        bottom: ty + store.pipe.top.sprite.height
                                    },

                                    sprite: store.pipe.top.sprite
                                },

                                bottom: {

                                    x: bx,

                                    y: by,

                                    rect: {

                                        left: bx,

                                        top: by,

                                        right: bx + store.pipe.bottom.sprite.width,

                                        bottom: by + store.pipe.bottom.sprite.height
                                    },

                                    sprite: store.pipe.bottom.sprite
                                }
                            });
                        }
                    }

                    // персонаж

                    if (!store.bird.die) {

                        if (((store.bird.frequency + 1) % 4) == 0) {
                            
                            store.bird.frequency = 0;
                            
                            store.bird.index++;

                            if (store.bird.index >= store.bird.sprites.length) {
                            
                                store.bird.index = 0;
                            }
                        }

                        store.bird.frequency++
                    }

                    if (store.bird.rotation <= 45) {
                            
                        store.bird.rotation += store.bird.speed;
                    }

                    if (store.bird.velocityY < store.bird.maxVelocityY && !store.bird.flapped) {
                        
                        store.bird.velocityY += store.bird.accelerationY;
                    }

                    if (store.bird.flapped) {

                        store.bird.flapped = false;

                        store.bird.rotation = -45;
                    }

                    const character = store.bird.sprites[store.bird.index];
                    
                    store.bird.position.y += Math.min(store.bird.velocityY, (screen.height - store.base.sprite.height) - store.bird.position.y - character.height);
                        
                    let rotation = store.bird.rotationThreshold;

                    if (store.bird.rotation <= store.bird.rotationThreshold) {
                            
                        rotation = store.bird.rotation;
                    }

                    // очки

                    const digits = store.score.value.toString().split('').map(x => parseInt(x));

                    let scoreTotalWidth = 0;

                    for(var i = 0; i < digits.length; i++) {
                            
                        const digit = digits[i];

                        scoreTotalWidth += store.score.sprites[digit].width;
                    }
                    
                    store.score.offset = Math.floor((screen.width - scoreTotalWidth) / 2);
                    
                    // --------- рисование

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

                    context.save();

                    const x = store.bird.position.x;

                    const y = store.bird.position.y + character.height;

                    store.bird.rect.left = Math.floor(x + (-character.width / 2));

                    store.bird.rect.top = Math.floor(y + (-character.height / 2));

                    store.bird.rect.right = store.bird.rect.left + character.width;

                    store.bird.rect.bottom = store.bird.rect.top + character.height;

                    context.translate(x, y);

                    if (store.bird.die) {

                        store.bird.rotation = 90;

                        context.rotate(store.bird.rotation * Math.PI / 180);

                    } else {

                        context.rotate(rotation * Math.PI / 180);
                    }
                    
                    context.drawImage(character, -character.width / 2, -character.height / 2);

                    context.restore();

                    // очки

                    for(var i = 0; i < digits.length; i++) {
                        
                        const digit = digits[i];

                        const scoreSprite = store.score.sprites[digit];

                        context.drawImage(scoreSprite, store.score.offset, 52);

                        store.score.offset += scoreSprite.width;
                    }
                }
            }
        }

        super.render(time);
    } 
};