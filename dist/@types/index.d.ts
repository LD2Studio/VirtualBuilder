export { THREE };
export namespace app {
    let canvas: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: any;
    let outliner: Outliner;
    let physics: PhysicsEngine;
    let assetManager: null;
    let inputManager: null;
    /**
     * Initialize application
     *
     * @param {{
     *  title: string,
     *  interactive: boolean,
     *  renderOptions: object,
     *  physicsOptions: object,
     * }} options   Settings
     */
    function init(options?: {
        title: string;
        interactive: boolean;
        renderOptions: object;
        physicsOptions: object;
    }): void;
    function loop(time: any, deltaTime: any): void;
    function onRender(time: any, deltaTime: any): void;
    /**
     * Asset Description
     *
     * @typedef {Object} AssetDesc
     * @property {string} name
     * @property {Array} rigid_bodies
     * @property {Array} joints
     */
    /**
     * Create an asset from description object
     * @example
     * // Template for an asset description object
     * const assetDesc = {
     *    name: 'My asset',
     *    rigid_bodies: [...],
     *    joints: [...]
     * }
     * @param {AssetDesc} assetDesc Description
     * @returns {Asset}
     */
    function createAsset(assetDesc: {
        name: string;
        rigid_bodies: any[];
        joints: any[];
    }): Asset;
    /**
     * Input type
     *
     * @typedef {Object} InputType
     * @property {function} on Callbacks
     */
    /**
     * Add an input to interact with the application
     *
     * @param {Array<string>} keys List of keyboard keys
     * @returns {InputType}
     */
    function addInput(keys: Array<string>): {
        /**
         * Callbacks
         */
        on: Function;
    };
}
import { Outliner } from './ui/outliner.js';
import { PhysicsEngine } from './core/physics.js';
import { Asset } from './core/asset-manager.js';
//# sourceMappingURL=index.d.ts.map