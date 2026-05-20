import RAPIER from '@dimforge/rapier3d-compat'
import * as THREE from 'three'

await RAPIER.init();

class PhysicsEngine extends RAPIER.World{
    #timeAccumulator = 0
    constructor( scene , physicsOptions ) {
        const gravity = new RAPIER.Vector3(0, -9.81, 0);
        console.log(`RAPIER.JS version ${RAPIER.version()}`);
        super(gravity);

        const colliderDebug = physicsOptions.colliderDebug ?? false;
        const ip = this.integrationParameters;
        // console.log(ip)
        if (physicsOptions.contact_natural_frequency) ip.contact_natural_frequency = physicsOptions.contact_natural_frequency
        ip.lengthUnit = physicsOptions.lengthUnit ?? 1;
        ip.numInternalPgsIterations = physicsOptions.numInternalPgsIterations ?? 1;
        ip.numSolverIterations = physicsOptions.numSolverIterations ?? 4;
        this.scene = scene;
        this.colliderDebug = colliderDebug;

        this.colliderHelper = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true, })
        );
        this.colliderHelper.frustumCulled = false;
        this.scene.add(this.colliderHelper);

        this.updateCollidersHelper = () => {
            const { vertices, colors } = this.debugRender();
            this.colliderHelper.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            this.colliderHelper.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
        }

        this.isRunning = true
        this.oneShot = false
    }

    update( deltaTime ) {
        this.#timeAccumulator += deltaTime
        const TIMESTEP = this.timestep
        const MAX_STEPS = 10

        let stepCount = 0
        while (this.#timeAccumulator >= TIMESTEP) {
            if (this.isRunning) {
                this.loop(TIMESTEP)
                this.step()
                if (this.oneShot) {
                    this.oneShot = false
                    this.isRunning = false
                }
            }
            this.#timeAccumulator -= TIMESTEP
            stepCount++
            if (stepCount >= MAX_STEPS) {
                this.#timeAccumulator = 0
                break
            }
        }

        if (this.colliderDebug) {
            this.updateCollidersHelper()
            this.colliderHelper.visible = true
        }
        else this.colliderHelper.visible = false
    }

    loop(TIMESTEP) {}
}

export { PhysicsEngine }