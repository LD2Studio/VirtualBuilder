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
 * Application of Virtual Builder
 *
 * @property {THREE.WebGLRenderer} renderer - WebGL Renderer of the application
 * @property {THREE.Scene} scene - 3D Scene of the application
 * @property {THREE.PerspectiveCamera} camera - Camera of the application
 * @property {PhysicsEngine} physics - Physics world of the application
 * @property {AssetManager} assetManager - Asset manager of the application
 * @property {Outliner} outliner - Outliner of the application
 * @function run - Launch the application
 */
export const app = {
    /**
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
        this.renderer = new THREE.WebGLRenderer(renderOptions);
        createRendererCanvas();
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
    addInput( keys, callback ) {
        return this.inputManager.addBinding( keys, callback );
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

function createRendererCanvas() {
    // Stylize body
    document.body.style.margin = 0;
    // document.body.style.height = '100vh';
    document.body.style.backgroundColor = 'black';
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    app.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(app.renderer.domElement);

    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.camera.position.set(0, 0, 5);

    window.addEventListener('resize', () => {
        app.camera.aspect = window.innerWidth / window.innerHeight;
        app.camera.updateProjectionMatrix();
        app.renderer.setSize(window.innerWidth, window.innerHeight);
        app.renderer.setPixelRatio(window.devicePixelRatio);
    });
}