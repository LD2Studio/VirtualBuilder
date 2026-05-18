import { Pane } from 'tweakpane';
import { REVISION } from 'three';

class Outliner extends Pane {
    constructor(scene, camera, camControl, renderer, physics) {
        super({
            title: 'Settings', expanded: false,
        })
        this.scene = scene
        this.camera = camera
        this.camControl = camControl
        this.renderer = renderer
        this.physics = physics

        this.#createSceneCameraPane()
        this.#createGPUPane()
        this.#createPhysicsPane()
    }

    #createSceneCameraPane() {
        const cameraProps = this.addFolder({
            title: '📸 Camera', expanded: false,
        })
        // Camera position
        const positionFolder = cameraProps.addFolder({
            title: 'Position',
        })

        positionFolder.addBinding(this.camera.position, 'x', {
            readonly: true, label: 'X',
        })

        positionFolder.addBinding(this.camera.position, 'y', {
            readonly: true, label: 'Y',
        })

        positionFolder.addBinding(this.camera.position, 'z', {
            readonly: true, label: 'Z',
        })
        // Camera target
        const targetFolder = cameraProps.addFolder({
            title: 'Target',
        })

        targetFolder.addBinding(this.camControl.target, 'x', {
            readonly: true, label: 'X',
        })

        targetFolder.addBinding(this.camControl.target, 'y', {
            readonly: true, label: 'Y',
        })

        targetFolder.addBinding(this.camControl.target, 'z', {
            readonly: true, label: 'Z',
        })
    }

    #createGPUPane() {
        // GPU monitoring
        const gpuFolder = this.addFolder({
            title: `📈 GPU (Three.js r${REVISION})`, expanded: false,
        })

        const backend = this.renderer.isWebGLRenderer ? 'WebGL' :
            this.renderer.isWebGPURenderer ? this.renderer.backend.isWebGPUBackend ? 'WebGPU' : 'WebGL2' : 'Unknown';
        gpuFolder.addBlade({
            view: 'text',
            label: 'Backend',
            parse: value => value,
            value: backend,
            disabled: true,
        })

        if (this.renderer.isWebGLRenderer) {
            const renderFolder = gpuFolder.addFolder({ title: '🖼️ Render' })
            renderFolder.addBinding( this.renderer.info.render, 'frame', { label: 'Frame ID', readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'calls', { label: 'DrawCalls', readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'triangles', { readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'points', { readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'lines', { readonly: true} )
            const memoryFolder = gpuFolder.addFolder({ title: '🖥️ Memory' })
            memoryFolder.addBinding( this.renderer.info.memory, 'geometries', { readonly: true} )
            memoryFolder.addBinding( this.renderer.info.memory, 'textures', { readonly: true} )
            const programsFolder = gpuFolder.addFolder({ title: '⚡ Shaders' })
            programsFolder.addBinding( this.renderer.info.programs, 'length', { readonly: true, label: 'Count'} )
        }
        else if (this.renderer.isWebGPURenderer) {
            const renderFolder = gpuFolder.addFolder({ title: '🖼️ Render' })
            renderFolder.addBinding( this.renderer.info, 'frame', { label: 'Frame ID', readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'drawCalls', { label: 'DrawCalls', readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'frameCalls', { label: 'FrameCalls', readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'triangles', { readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'points', { readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'lines', { readonly: true} )
            renderFolder.addBinding( this.renderer.info.render, 'timestamp', { readonly: true} )
            const memoryFolder = gpuFolder.addFolder({ title: '🖥️ Memory' })
            memoryFolder.addBinding( this.renderer.info.memory, 'geometries', { label: 'Geometries', readonly: true} )
            memoryFolder.addBinding( this.renderer.info.memory, 'textures', { label: 'Textures', readonly: true} )
        }
    }

    #createPhysicsPane() {
        const physicsFolder = this.addFolder({
            title: '🚀 Physics', expanded: false,
        })

        physicsFolder.addBinding(this.physics, 'colliderDebug', {
            label: 'Collision shapes',
        })

        physicsFolder.addBinding(this.physics, 'timestep', {
            label: 'Time step',
            min: 0.001,
            max: 0.01,
            // step: 0.001
        })
    }
}

export { Outliner }