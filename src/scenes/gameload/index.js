import { Scene, Screen, Game } from '../../engine';
import helper from '../../helper';


export default class GameLoad extends Scene {

    /**
     * Конструктор сцены загрузки.
     */
    constructor() {

        super();

        this.store = {

            loaded: false,

            indicator: {

                symbols: [ ' ', ' ', ' ', ' ', ' ' ],
    
                offset: 0,
    
                counter: 0,
    
                speed: 4
            }
        }
    }

    /**
     * Прелоадер сцены загрузки.
     * 
     * @param { Game } game Класс игры.
     * @param { object } props Свойства сцены загрузки.
     */
    preloader(game, props) {

        Object.assign(game.resources, {

            audioDie: 'assets/audio/die.mp3',

            audioHit: 'assets/audio/hit.mp3',

            audioPoint: 'assets/audio/point.mp3',

            audioWing: 'assets/audio/wing.mp3'
        });

        const images = {

            image0: 'assets/image/0.png',

            image1: 'assets/image/1.png',

            image2: 'assets/image/2.png',

            image3: 'assets/image/3.png',

            image4: 'assets/image/4.png',

            image5: 'assets/image/5.png',

            image6: 'assets/image/6.png',

            image7: 'assets/image/7.png',

            image8: 'assets/image/8.png',

            image9: 'assets/image/9.png',

            imageBackgroundDay: 'assets/image/background-day.png',

            imageBackgroundNight: 'assets/image/background-night.png',

            imageBase: 'assets/image/base.png',

            imageMessage: 'assets/image/message.png',

            imageBlueBirdUpFlap: 'assets/image/bluebird-upflap.png',

            imageBlueBirdMidFlap: 'assets/image/bluebird-midflap.png',

            imageBlueBirdDownFlap: 'assets/image/bluebird-downflap.png',

            imageRedBirdUpFlap: 'assets/image/redbird-upflap.png',

            imageRedBirdMidFlap: 'assets/image/redbird-midflap.png',
            
            imageRedBirdDownFlap: 'assets/image/redbird-downflap.png',

            imageYellowBirdUpFlap: 'assets/image/yellowbird-upflap.png',

            imageYellowBirdMidFlap: 'assets/image/yellowbird-midflap.png',
            
            imageYellowBirdDownFlap: 'assets/image/yellowbird-downflap.png',

            imagePipeTopGreen: 'assets/image/pipe-top-green.png',

            imagePipeBottomGreen: 'assets/image/pipe-bottom-green.png',

            imagePipeTopRed: 'assets/image/pipe-top-red.png',

            imagePipeBottomRed: 'assets/image/pipe-bottom-red.png',

            imageGameOver: 'assets/image/gameover.png'
        };

        helper.imageLoader(images, (err, resources) => {

            if (!err) {

                game.resources = Object.assign(game.resources, resources);
            
                this.store.loaded = true;

            } else {

                console.log(err);
            }
        });

        super.preloader(game, props);
    }

    /**
     * Рендер сцены загрузки.
     * 
     * @param { number } time Время запланированной анимации.
     */
    render(time) {

        const store = this.store;

        const game = this.game;

        if (game instanceof Game) {

            const screen = game.screen;

            if (screen instanceof Screen) {

                if (store.loaded) {
                    
                    //this.switchScene('splash');

                    this.switchScene('gamemenu');
                }

                const context = screen.context;

                // заливка экрана
                context.fillStyle = '#000000';
                
                context.fillRect(0, 0, screen.width, screen.height);

                // текст загрузки
                context.fillStyle = '#ffffff';
                
                context.font = '22px Oswald';
               
                context.textAlign = 'center';
                
                context.fillText('Loading', Math.floor(screen.width / 2), Math.floor(screen.height / 2) - 12);

                // индикатор загрузки
                context.fillStyle = '#ffffff';
                
                context.font = '22px Oswald';
                
                context.textAlign = 'center';
                
                context.fillText(store.indicator.symbols.join(' '), Math.floor(screen.width / 2), Math.floor(screen.height / 2) + 12);

                if (store.indicator.offset >= store.indicator.symbols.length) {
                
                    store.indicator.offset = 0;
                }

                if ((store.indicator.counter + 1) % store.indicator.speed === 0) {

                    store.indicator.counter = 0;

                    switch (store.indicator.symbols[store.indicator.offset]) {
                
                        case ' ':
                            store.indicator.symbols[store.indicator.offset] = '•';
                            break;
                
                        default:
                            store.indicator.symbols[store.indicator.offset] = ' ';
                            break;
                    }

                    store.indicator.offset++;
                }

                store.indicator.counter++;
            }
        }

        super.render(time);
    } 
};