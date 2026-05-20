
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
     * 
     * @private
     * @example
     * const input = new InputManager();
     * input.map = [
     *     { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
     *     { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
     *     { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
     *     { name: 'right', keys: ['ArrowRight', 'KeyD'] },
     *     { name: 'run', keys: ['ShiftLeft', 'ShiftRight']}
     * ]
     */
    constructor() {

        super()

        this.inputs = [];
        // this._actions = [];
        // this.actionState = {};
        this.pointer = {
            x: 0,
            y: 0
        }
        window.addEventListener('keydown', (event) => {
            if (event.target === document.body) {
                // console.log(`keydown : ${event.code}`)
                this._down(event.code)
            }
        })

        window.addEventListener('keyup', (event) => {
            if (event.target === document.body) {
                // console.log(`keyup : ${event.code}`)
                this._up(event.code)
            }
        })

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

    /**
     * Sets the actions for this input manager
     * 
     * @param {Object[]} newActions - The new actions to set
     * 
     * Each action is an object with the following properties:
     * - name: The name of the action
     * - keys: An array of keys that will trigger the action
     */
    // set map(newActions) {
    //     this._actions = newActions;
    //     this._actions.forEach( action => {
    //         this.actionState[action.name] = {
    //             pressed: false,
    //             justPressed: false,
    //             _lastPressed: false,
    //         };
    //     });
    // }

    // connect(actionName, callback) {
    //     this.addEventListener(actionName, callback)
    // }

    // isPressed(actionName) {
    //     // console.log(this.actionState[actionName])
    //     return this.actionState[actionName].pressed;
    // }

    // isJustPressed(actionName) {
    //     if (this.actionState[actionName].justPressed) {
    //         this.actionState[actionName].justPressed = false;
    //         return true;
    //     }
    //     return false;
    // }

    _down(key) {
        // const action = this._actions.find( action => action.keys.includes(key) )
        // if (action !== undefined) {
        //     // console.log(`"${action.name}" action down`)
        //     this.actionState[action.name].pressed = true;
        //     this.dispatchEvent(new CustomEvent(action.name))
        //     if (!this.actionState[action.name]._lastPressed) {
        //         this.actionState[action.name].justPressed = true;
        //         this.actionState[action.name]._lastPressed = true;
        //         // console.log(`"${action.name}" just pressed`)
        //     }
        // }
        const input = this.inputs.find( input => input.keys.includes(key) );
        if (input) {
            // console.log(input);
            input.pressed = true;
            if (input.pressedCb) input.pressedCb();
        }
    }

    _up(key) {
        // const action = this._actions.find( action => action.keys.includes(key) )
        // if (action !== undefined) {
        //     // console.log(`${action.name} up`)
        //     this.actionState[action.name].pressed = false;
        //     this.actionState[action.name].justPressed = false;
        //     this.actionState[action.name]._lastPressed = false;
        // }
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