import { app } from '../../lib/index.js'
app.init({
    interactive: true,
    renderOptions: {
        antialias: true,
    }
})

const cubeDesc = {
    name: 'My Cube',
    rigid_bodies: [
        {   id: 'rb1',
            type: 'static',
            meshes: [
                {
                    geometry: {
                        shape: 'box',
                        size: [1, 1, 1]
                    },
                    visual: {
                        color: 'limegreen',
                    },
                    collider : true,
                }
            ],
            // position: [0, 0.5, 0],
            // rotation: [0, 0, 0],
        }
    ]
}
app.createAsset(cubeDesc)
