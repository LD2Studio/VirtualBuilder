import { app } from '../../lib/index.js'

app.init({
    interactive: true,
})
app.camera.position.set(1.74, 4.51, 7.89)

import { floorDesc } from '../../public/assetlib/floor.js'
app.createAsset(floorDesc)

const cubeDesc = {
    name: 'My Cube',
    rigid_bodies: [
        {   id: 'rb1',
            type: 'dynamic',
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
        }
    ]
}
app.createAsset(cubeDesc).translate(0, 3, 0)
