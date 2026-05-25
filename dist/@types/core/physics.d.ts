export class PhysicsEngine extends RAPIER.World {
    constructor(scene: any, physicsOptions: any);
    scene: any;
    colliderDebug: any;
    colliderHelper: any;
    updateCollidersHelper: () => void;
    isRunning: boolean;
    oneShot: boolean;
    update(deltaTime: any): void;
    loop(TIMESTEP: any): void;
    #private;
}
import RAPIER from '@dimforge/rapier3d-compat';
//# sourceMappingURL=physics.d.ts.map