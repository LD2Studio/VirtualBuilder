export const robot2wheelsDesc = {
    name: 'Robot 2 Wheels',
    rigid_bodies: [
        {
            id: 'chassis', type: 'dynamic',
            meshes: [
                {
                    geometry: { shape: 'cylinder', radius: 0.2, height: 0.04 },
                    visual: { color: 'yellow'},
                    collider: true
                },
                {
                    geometry: { shape: 'sphere', radius: 0.03, offset: [0, -0.017, 0.15] },
                    visual: { color: 'orange'},
                    collider: { friction: 0, combinedFriction: 'Min' },
                }
            ],
            position: [0,0.05,0]
        },
        {
            id: 'right wheel', type: 'dynamic',
            meshes: [
                {
                    geometry: { shape: 'cylinder', radius: 0.05, height: 0.03, rotation: [0, 0, Math.PI/2] },
                    visual: { color: 'blue'},
                    collider: { friction: 0.8, combinedFriction: 'Max' }
                }
            ],
            position: [0.22,0.055,0]
        },
        {
            id: 'left wheel', type: 'dynamic',
            meshes: [
                {
                    geometry: { shape: 'cylinder', radius: 0.05, height: 0.03, rotation: [0, 0, Math.PI/2] },
                    visual: { color: 'blue'},
                    collider: { friction: 0.8, combinedFriction: 'Max',
                    }
                }
            ],
            position: [-0.22,0.05,0]
        }
    ],
    joints: [
        {
            id: 'right motor', type: 'revolute',
            body_a: 'chassis', body_b: 'right wheel',
        },
        {
            id: 'left motor', type: 'revolute',
            body_a: 'chassis', body_b: 'left wheel',
        }
    ]
}