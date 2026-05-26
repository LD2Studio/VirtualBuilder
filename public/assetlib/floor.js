export const floorDesc = {
    name: 'Floor',
    rigid_bodies: [
        {
            id: 'rb1', type: 'static',
            meshes: [
                {
                    geometry: {
                        shape: 'box', size: [10, 0.1, 10]
                    },
                    visual: {
                        color: 'green'
                    },
                    collider: true
                }
            ]
        }
    ]
}