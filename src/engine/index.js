import helper from '../helper';

export class Scene {

    /**
     * Конструктор сцены.
     */
    constructor() {

        /** @type { Game|null } */
        this.game = null;

        /** @type {{ state: boolean, scene: (string|null), props: (object|null) }} */
        this.next = {

            state: false,

            scene: null,

            props: null
        }
    }

    /**
     * Прелоадер сцены.
     * 
     * @param { Game } game Класс игры.
     * @param { object } props Свойства сцены.
     */
    preloader(game, props) {

        this.game = game;

        this.next.state = true;

        this.next.props = props;
    }

    /**
     * Рендер сцены.
     * 
     * @param { number } time Время запланированной анимации.
     */
    render(time) {}
    
    /**
     * Переключение сцены.
     * 
     * @param { string } name Имя сцены.
     * @param { object } [props] Свойства сцены.
     */
    switchScene(name, props) {

        if (this.game instanceof Game) {

            if ((name in this.game.scenes) && (name !== this.game.scene)) {

                this.next = {

                    state: false,

                    scene: name,

                    props: props
                }

                return true;
            }
        }

        return false;
    }
};

export class Screen {

    /**
     * Конструктор экрана.
     * 
     * @param { number } width Ширина экрана.
     * @param { number } height Высота экрана.
     */
    constructor(width, height) {

        this.width = width;

        this.height = height;

        this.canvas = helper.getCanvas(this.width, this.height);

        this.context = this.canvas.getContext('2d');
    }

    /**
     * Детектор столкновения объектов.
     * 
     * @param { { left: number, top: number, right: number, bottom: number } } source Координаты исходного объекта.
     * @param { { left: number, top: number, right: number, bottom: number } } target Координаты объект для столкновения.
     */
    hitBox(source, target) {

        const left = (source.left < target.left) ? target.left : source.left;

        const top = (source.top < target.top) ? target.top : source.top;

        const right = (source.right < target.right) ? source.right : target.right;

        const bottom = (source.bottom < target.bottom) ? source.bottom : target.bottom;

        return right > left && bottom > top;
    }
};

export class Game {

    /**
     * Конструктор игры.
     * 
     * @param { number } width Ширина.
     * @param { number } height Высота.
     */
    constructor(width, height) {

        /** @type { Screen } */
        this.screen = new Screen(width, height);

        /** @type { Object.<string, Scene> } */
        this.scenes = {};

        /** @type { Scene|null } */
        this.scene = null;

        /** @type { Object.<string, object> } */
        this.resources = {};

        /** @type { KeyboardEvent|null } */
        this.keydownEvent = null;

        /** @type { KeyboardEvent|null } */
        this.keypressEvent = null;

        /** @type { KeyboardEvent|null } */
        this.keyupEvent = null;

        /** @type { MouseEvent|null } */
        this.mousedownEvent = null;

        /** @type { MouseEvent|null } */
        this.mouseupEvent = null;

        /** @type { MouseEvent|null } */
        this.mousemoveEvent = null;

        /** @type { MouseEvent|null } */
        this.mouseoverEvent = null;

        /** @type { MouseEvent|null } */
        this.mouseoutEvent = null;

        /** @type { MouseEvent|null } */
        this.clickEvent = null;

        /** @type { MouseEvent|null } */
        this.dblclickEvent = null;
    }

    /**
     * Довить сцену.
     * 
     * @param { string } name Имя сцены.
     * @param { Scene } scene Сцена.
     */
    addScene(name, scene) {

        if (!(name in this.scenes)) {
                
            this.scenes[name] = scene;
        }
    }

    /**
     * Запуск игры.
     * 
     * @param { string } name Имя сцены.
     */
    run(name) {

        if (name in this.scenes) {
                
            const scene = this.scenes[name];

            if (typeof scene.preloader !== 'undefined' && typeof scene.preloader === 'function') {
                        
                this.scene = scene;

                this.scene.preloader(this);
            }
        }

        const render = (time) => {

            if (this.scene instanceof Scene) {

                if (!this.scene.next.state) {

                    if (typeof this.scene.next.scene === 'string') {
                        
                        if (this.scene.next.scene in this.scenes) {

                            const scene = this.scenes[this.scene.next.scene];

                            if (typeof scene.preloader !== 'undefined' && typeof scene.preloader === 'function') {
                            
                                const props = this.scene.next.props;

                                this.scene = scene;

                                this.scene.preloader(this, props);
                            }
                        }
                    }
                }

                this.scene.render(time);

                this.keydownEvent = null;

                this.keypressEvent = null;

                this.keyupEvent = null;

                this.mousedownEvent = null;

                this.mouseupEvent = null;

                this.mousemoveEvent = null;

                this.mouseoverEvent = null;

                this.mouseoutEvent = null;

                this.clickEvent = null;

                this.dblclickEvent = null;
            }

            requestAnimationFrame(render);
        }

        document.addEventListener('keydown', e => this.keydownEvent = e, false);

        document.addEventListener('keypress', e => this.keypressEvent = e, false);

		document.addEventListener('keyup', e => this.keyup = e, false);

        document.addEventListener('mousedown', e => this.mousedownEvent = e, false);
        
        document.addEventListener('mouseup', e => this.mouseupEvent = e, false);

        document.addEventListener('mousemove', e => this.mousemoveEvent = e, false);

        document.addEventListener('mouseover', e => this.mouseoverEvent = e, false);

        document.addEventListener('mouseout', e => this.mouseoutEvent = e, false);

        document.addEventListener('click', e => this.clickEvent = e, false);

        document.addEventListener('dblclick', e => this.dblclickEvent = e, false);

        requestAnimationFrame(render);
    }
}

export default {
    Scene,
    Screen,
    Game
};