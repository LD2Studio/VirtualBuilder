import { app } from '../../lib/main.js'
import { floorDesc } from './floor.js'
app.init({
    interactive: true,
})
app.camera.position.set(0.0, 6.55, 8.87)

const floor = app.createAsset(floorDesc)

const cubeDesc = {
    name: 'Green Cube',
    rigid_bodies: [
        { 
            id: 'rb1', type: 'dynamic',
            meshes: [
                { 
                    geometry: {
                        shape: 'box', size: [1,1,1]
                    },
                    visual: {
                        color: 'limegreen'
                    },
                    collider: true
                }
            ]
        }
    ]
}

const cubeInput = app.addInput(['ArrowUp'])
cubeInput.on( () => app.createAsset(cubeDesc) )


// app.onRender = () => {
//     if (cubeInput.pressed) {
//         app.createAsset(cubeDesc)
//     }
// }
