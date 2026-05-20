import { app } from '../../lib/index.js'

app.init({
    title: 'Robot 2 Wheels',
    interactive: true,
    physicsOptions: {
        contact_natural_frequency: 30, lengthUnit: 0.1,
        numSolverIterations: 10, numInternalPgsIterations: 4,
        colliderDebug: true,
    }
})
app.camera.position.set(0, 0.6, 0.6)

import { floorDesc } from './floor.js'
app.createAsset(floorDesc)

import { robot2wheelsDesc } from './robot2wheels.js'
const myRobot = app.createAsset(robot2wheelsDesc)

const forward = app.addInput(['ArrowUp','KeyW'])
const backward = app.addInput(['ArrowDown', 'KeyS'])
const left = app.addInput(['ArrowLeft', 'KeyA'])
const right = app.addInput(['ArrowRight', 'KeyD'])
const boost = app.addInput(['ShiftLeft','ShiftRight'])

const BOOST = 2

// app.onRender = () => {
app.physics.loop = (time) => {
    // console.log(time)
    myRobot['left motor'].targetVelocity = 0
    myRobot['right motor'].targetVelocity = 0
    if (forward.pressed) {
        myRobot['left motor'].targetVelocity = - 2 * (boost.pressed ? BOOST : 1)
        myRobot['right motor'].targetVelocity = -2 * (boost.pressed ? BOOST : 1)
    }
    if (backward.pressed) {
        myRobot['left motor'].targetVelocity = 2 * (boost.pressed ? BOOST : 1)
        myRobot['right motor'].targetVelocity = 2 * (boost.pressed ? BOOST : 1)
    }
    if (left.pressed) {
        myRobot['left motor'].targetVelocity = 2 * (boost.pressed ? BOOST : 1)
        myRobot['right motor'].targetVelocity = -2 * (boost.pressed ? BOOST : 1)
    }
    if (right.pressed) {
        myRobot['left motor'].targetVelocity = -2 * (boost.pressed ? BOOST : 1)
        myRobot['right motor'].targetVelocity = 2 * (boost.pressed ? BOOST : 1)
    }
}
