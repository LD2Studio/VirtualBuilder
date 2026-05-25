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
    constructor(canvas: any);
    inputs: any[];
    pointer: {
        x: number;
        y: number;
    };
    add(keys?: any[]): Input;
    _down(key: any): void;
    _up(key: any): void;
}
/**
 * Input class
 */
declare class Input {
    constructor(keys: any);
    keys: any;
    pressedCb: Function | null;
    releaseCb: Function | null;
    uuid: `${string}-${string}-${string}-${string}-${string}`;
    pressed: boolean;
    justPressed: boolean;
    _lastPressed: boolean;
    /**
     *
     * @param {function} pressedCb
     * @param {function} releaseCb
     * @returns
     */
    on(pressedCb?: Function, releaseCb?: Function): this;
}
export {};
//# sourceMappingURL=input-manager.d.ts.map