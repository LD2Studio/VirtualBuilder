import * as THREE from 'three'

const grid = new THREE.GridHelper(10, 10, new THREE.Color('#ffffff'), new THREE.Color('#9c9c9c'));
grid.material.opacity = 0.5;
grid.material.transparent = true;

export const floorDesc = {
    name: 'Floor',
    rigid_bodies: [
        {
            id: 'rb1', type: 'static',
            meshes: [
                {
                    geometry: {
                        shape: 'box', size: [10, 0.1, 10], offset: [0, -0.05, 0]
                    },
                    visual: {
                        color: 'green'
                    },
                    collider: true
                },
                {
                    mesh: grid
                }
            ]
        }
    ]
}