
/**
 * InputManager class
 */

export class InputManager extends EventTarget {
    /**
     * Constructor
     * 
     * Initialize the input manager
     * 
     * Listens to keydown, keyup and pointermove events
     */
    constructor(canvas) {
        super()

        this.inputs = [];
        this.pointer = {
            x: 0,
            y: 0
        }
        canvas.addEventListener('keydown', (event) => {
            event.preventDefault();
            // console.log(`keydown : ${event.code}`);
            this._down(event.code);
        });

        canvas.addEventListener('keyup', (event) => {
            // console.log(`keyup : ${event.code}`);
            this._up(event.code);
        });

        window.addEventListener('pointermove', (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1; // [-1,1]
            this.pointer.y = (-event.clientY / window.innerHeight) * 2 + 1; // [-1,1]
        })
    }

    add(keys = []) {
        const input = new Input(keys);
        this.inputs.push( input );
        return input;
    }

   

    _down(key) {
        const input = this.inputs.find( input => input.keys.includes(key) );
        if (input) {
            // console.log(input);
            input.pressed = true;
            if (input.pressedCb) input.pressedCb();
        }
    }

    _up(key) {
        const input = this.inputs.find( input => input.keys.includes(key) );
        if (input) {
            // console.log(input);
            input.pressed = false;
            if (input.releaseCb) input.releaseCb();
        }
    }
}

/**
 * Input class
 */
class Input {
    constructor( keys ) {
        this.keys = keys;
        this.pressedCb = null;
        this.releaseCb = null;
        this.uuid = crypto.randomUUID();
        this.pressed = false;
        this.justPressed = false;
        this._lastPressed = false;
    }
    /**
     * 
     * @param {function} pressedCb 
     * @param {function} releaseCb 
     * @returns 
     */
    on( pressedCb = null, releaseCb = null ) {
        this.pressedCb = pressedCb;
        this.releaseCb = releaseCb;
        return this;
    }
}