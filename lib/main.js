const VERSION = '0.0.1';
console.log(`VirtualBuilder version ${VERSION}`);

import * as THREE from 'three';
console.log(`THREE.JS version 0.${THREE.REVISION}`);
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export { THREE }

import { PhysicsEngine } from './core/physics.js';
import { AssetManager } from './core/asset-manager.js';
import { InputManager } from './core/input-manager.js';
import { Outliner } from './ui/outliner.js';

const internals = {
    interactive: false,
    orbitalControls: null,
}

/**
 * VirtualBuilder application
 */
export const app = {
    /**
     * This is the canvas where is rendered 3d scene
     * @type {HTMLCanvasElement}
     */
    canvas: null,
    /**
     * This is the renderer engine used by VirtualBuilder
     * @type {THREE.WebGLRenderer}
     */
    renderer: null,
    /**
     * @type {THREE.Scene}
     */
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    /**
     * Setting panel
     * @type {Outliner}
     */
    outliner: null,
    /**
     * @type {PhysicsEngine}
     */
    physics: null,
    assetManager: null,
    inputManager: null,
    /**
     * Initialize application
     * 
     * @param {{
     *  title: string,
     *  interactive: boolean,
     *  colliderDebug: boolean,
     * }} options   Settings
     */
    init(options = {}) {
        const {
            title = 'Untitled',
            interactive = false,
            vr = false,
            ar = false,
            monitor = false,
            renderOptions = {},
            colliderDebug = false
        } = options;

        document.title = `${title} ${interactive ? '- Interactive' : ''}`;
        initStyle();
        initRendererCanvas( renderOptions );
        this.physics = new PhysicsEngine( this.scene, { colliderDebug } );
        this.assetManager = new AssetManager( this.scene, this.physics );
        this.inputManager = new InputManager();
        if (interactive) {
            internals.interactive = true;
            internals.orbitalControls = new OrbitControls( app.camera, app.renderer.domElement );
            internals.orbitalControls.enableDamping = true;
            this.outliner = new Outliner( this.scene, this.camera, internals.orbitalControls, this.renderer, this.physics );
        }
        this.renderer.setAnimationLoop(renderLoop);
    },
    onRender: (time, deltaTime) => {},
    createAsset(asset) {
        return this.assetManager.create(asset)
    },
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
    addInput( keys ) {
        return this.inputManager.add( keys );
    }
}

const timer = new THREE.Timer()
timer.connect( document )

function renderLoop( time ) {
    timer.update( time )
    const deltaTime = timer.getDelta()
    const elapsedTime = timer.getElapsed()

    app.physics.update(deltaTime)
    app.assetManager.update()

    app.onRender( elapsedTime, deltaTime )

    app.renderer.render( app.scene, app.camera )

    if (internals.interactive) {
        internals.orbitalControls.update()
    }
}

function initStyle() {
    // Stylize body
    document.body.style.margin = 0;
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
}

function initRendererCanvas( renderOptions ) {

    app.canvas = document.createElement('canvas');
    app.canvas.style.width = '100%';
    app.canvas.style.height = '100%';
    document.body.append(app.canvas);

    app.renderer = new THREE.WebGLRenderer({
        canvas: app.canvas,
        antialias: renderOptions.antialias ?? true,
    });

    app.renderer.setSize(app.canvas.clientWidth, app.canvas.clientHeight, false);
    app.renderer.setPixelRatio(window.devicePixelRatio);

    app.camera.aspect = app.canvas.clientWidth / app.canvas.clientHeight;
    app.camera.updateProjectionMatrix();
    app.camera.position.set(0, 0, 5);

    window.addEventListener('resize', () => {
        app.camera.aspect = app.canvas.clientWidth / app.canvas.clientHeight;
        app.camera.updateProjectionMatrix();
        app.renderer.setSize(app.canvas.clientWidth, app.canvas.clientHeight, false);
        app.renderer.setPixelRatio(window.devicePixelRatio);
    });
}