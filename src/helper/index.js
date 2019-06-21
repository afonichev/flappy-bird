export default {

    /**
     * Найти или создать канвас на странице.
     * 
     * @param { number } width Ширина канваса.
     * @param { number } height Высота канваса.
     */
    getCanvas: (width, height) => {

        const elements = document.getElementsByTagName('canvas');

        const canvas = elements[0] || document.createElement('canvas');

        canvas.width = width;

        canvas.height = height;

        document.body.appendChild(canvas);

        return canvas;
    },

    /**
     * Загрузчик изображений.
     * 
     * @param { Object.<string, string> } files Словарь с изображениями.
     * @param {{ (err: Error, resources: Object.<string, HTMLImageElement>): void }} callback Функция обратного вызова.
     */
    imageLoader: (files, callback) => {

        /** @type { Object.<string, HTMLImageElement> } */
        const resources = {};

        Promise.all(Object.keys(files).map(name => {

            return new Promise(resolve => {

                resources[name] = new Image();
                
                resources[name].onload = resolve;

                resources[name].src = files[name];
            });

        })).then(() => {

            callback(null, resources);
            
        }).catch(err => {

            callback(err, resources);
        });
    },

    /**
     * Рандомный выбор элемента из массива.
     * 
     * @param { Array<object> } value Массив.
     */
    randomArray: (value) => {

        return value[Math.floor(Math.random() * value.length)];
    },

    /**
     * Рандом.
     * 
     * @param { number } min Минимальное значение.
     * @param { number } max Максимальное значение.
     */
    random(min, max) {

        return Math.floor((Math.random() * (max - min)) + min);
    }
};