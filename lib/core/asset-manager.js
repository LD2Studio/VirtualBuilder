import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class AssetManager {
    constructor( scene, physics ) {
        this.scene = scene;
        this.physics = physics;
        this.assets = [];
        this.gltfLoader = new GLTFLoader();

        this.xray = false;
    }

    create(assetDesc) {
        const assetInstance = new Asset(assetDesc.name)

        if (assetDesc.rigid_bodies?.length > 0) {
            for (const rigidBody of assetDesc.rigid_bodies) {
                const entity = this.#createRigidBody(rigidBody)
                if (entity === null) {
                    continue
                }
                assetInstance.entities.push(entity)
            }
        }
        else {
            // console.warn('Missing rigid bodies')
            return null
        }
        if (assetDesc.joints?.length > 0) {
            for (const joint of assetDesc.joints) {
                const entity = this.#createJoint(joint, assetInstance)
                if (entity === null) {
                    continue
                }
                assetInstance.joints.push(entity)
                assetInstance[entity.id] = entity
            }
        }
        this.assets.push(assetInstance)

        return assetInstance
    }

    #createRigidBody(parameters) {

        if (!parameters.id) {
            console.error('Missing rigid body id')
            return null
        }
        let rigidBodyDesc = null
        switch (parameters.type) {
            case 'static':
                rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
                break
            case 'dynamic':
                rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
                break
        }
        const rigidBody = rigidBodyDesc === null ? null : this.physics.createRigidBody(rigidBodyDesc)
        // console.log('rigidBody: ', rigidBody)
        const rootMesh = new THREE.Group()
        const collidersDesc = [];
        if (parameters.meshes?.length > 0) {
            for (const mesh of parameters.meshes) {
                if (!mesh.geometry && !mesh.mesh) {
                    console.warn('Missing geometry')
                    return null
                }

                if (mesh.mesh) {
                    let customMaterial = null
                    if (mesh.visual) {
                        customMaterial = new THREE.MeshMatcapMaterial()
                    }
                    mesh.mesh.traverse((child) => {
                        if (child.isMesh) {
                            if (customMaterial) {
                                const color = mesh.visual.color 
                                    ? new THREE.Color(mesh.visual.color)
                                    : child.material.color
                                customMaterial.color = color
                                child.material = customMaterial
                            }
                        }
                    })
                    rootMesh.add(mesh.mesh)
                }

                if (mesh.geometry && mesh.visual) {
                    let geometry = null
                    let material = null

                    switch (mesh.geometry.shape) {
                        case 'box':
                            geometry = new THREE.BoxGeometry(
                                mesh.geometry.size[0],
                                mesh.geometry.size[1],
                                mesh.geometry.size[2]
                            )
                            break
                        case 'cylinder':
                            geometry = new THREE.CylinderGeometry(
                                mesh.geometry.radius ?? 1,
                                mesh.geometry.radius ?? 1,
                                mesh.geometry.height ?? 1
                            )
                            break
                        case 'sphere':
                            geometry = new THREE.SphereGeometry(
                                mesh.geometry.radius ?? 1
                            )
                            break
                        case 'custom':
                            console.log('custom geometry')
                            break
                        default:
                            console.warn('Unknown geometry shape: ' + mesh.geometry.shape)
                            return null
                    }

                    if (mesh.geometry.rotation) {
                        geometry.applyQuaternion(new THREE.Quaternion().setFromEuler(
                            new THREE.Euler(
                                mesh.geometry.rotation[0],
                                mesh.geometry.rotation[1],
                                mesh.geometry.rotation[2]
                            )
                        ))
                    }
                    if (mesh.geometry.offset) {
                        geometry.translate(
                            mesh.geometry.offset[0],
                            mesh.geometry.offset[1],
                            mesh.geometry.offset[2]
                        )
                    }

                    switch (mesh.visual.type) {
                        case 'matcap':
                            material = new THREE.MeshMatcapMaterial({
                                color: mesh.visual.color ?? 0xaaaaaa
                            })
                            break
                        default:
                            material = new THREE.MeshMatcapMaterial({
                                color: mesh.visual.color ?? 0xaaaaaa
                            })
                            break
                    }
                    rootMesh.add(new THREE.Mesh(geometry, material))
                }
                if (rigidBody && mesh.geometry && mesh.collider) {
                    let colliderDesc = null

                    switch (mesh.geometry.shape) {
                        case 'box':
                            if (mesh.geometry.borderRadius) {
                                colliderDesc = RAPIER.ColliderDesc.roundCuboid(
                                            mesh.geometry.size[0] / 2 - mesh.geometry.borderRadius,
                                            mesh.geometry.size[1] / 2 - mesh.geometry.borderRadius,
                                            mesh.geometry.size[2] / 2 - mesh.geometry.borderRadius,
                                            mesh.geometry.borderRadius
                                        )
                            }
                            else {
                                colliderDesc = RAPIER.ColliderDesc.cuboid(
                                    mesh.geometry.size[0] / 2,
                                    mesh.geometry.size[1] / 2,
                                    mesh.geometry.size[2] / 2
                                )
                            }
                            break
                        case 'cylinder':
                            colliderDesc = RAPIER.ColliderDesc.cylinder(
                                (mesh.geometry.height / 2) ?? 1,
                                mesh.geometry.radius ?? 1
                            )
                            break
                        case 'sphere':
                            colliderDesc = RAPIER.ColliderDesc.ball(
                                mesh.geometry.radius ?? 1
                            )
                            break
                        default:
                            console.warn('Unknown geometry shape: ' + mesh.geometry.shape)
                            break
                    }
                    if (colliderDesc !== null) {
                        if (mesh.geometry.offset) {
                            colliderDesc.setTranslation(
                                mesh.geometry.offset[0],
                                mesh.geometry.offset[1],
                                mesh.geometry.offset[2]
                            )
                        }
                        if (mesh.geometry.rotation) {
                            colliderDesc.setRotation(
                                new THREE.Quaternion().setFromEuler(
                                    new THREE.Euler(
                                        mesh.geometry.rotation[0],
                                        mesh.geometry.rotation[1],
                                        mesh.geometry.rotation[2]
                                    )
                                )
                            )
                        }
                        if (mesh.collider.friction !== undefined) {
                            colliderDesc.setFriction(mesh.collider.friction)
                        }
                        if (mesh.collider.combinedFriction !== undefined) {
                            switch (mesh.collider.combinedFriction) {
                                case 'Max':
                                    colliderDesc.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max)
                                    break
                                case 'Multiply':
                                    colliderDesc.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Multiply)
                                    break
                                case 'Min':
                                    colliderDesc.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min)
                                    break
                            }
                        }

                        collidersDesc.push(colliderDesc)
                    }
                }
            }
        }
        else {
            console.error('Missing meshes');
            return null;
        }
        if (collidersDesc.length > 0) {
            collidersDesc.forEach(colliderDesc => {
                this.physics.createCollider(colliderDesc, rigidBody)
            })
        }
        if (parameters.position) {
            if (rigidBody) {
                rigidBody.setTranslation(new RAPIER.Vector3(
                    parameters.position[0], parameters.position[1], parameters.position[2])
                )
            }
            rootMesh.position.set(parameters.position[0], parameters.position[1], parameters.position[2])
        }
        if (parameters.rotation) {
            if (rigidBody) {
                rigidBody.setRotation(new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(parameters.rotation[0], parameters.rotation[1], parameters.rotation[2], parameters.rotation[3]))
                )
            }
            rootMesh.rotation.set(parameters.rotation[0], parameters.rotation[1], parameters.rotation[2], parameters.rotation[3])
        }

        this.scene.add(rootMesh)

        const instance = {
            id: parameters.id,
            mesh: rootMesh,
            rigidBody,
        }

        return instance
    }

    #createJoint(parameters, asset) {
        // console.log('joint parameters: ', parameters)
        if (parameters.body_a === null || parameters.body_b === null) {
            console.error('Missing body_a or body_b')
            return
        }
        const entityA = asset.entities.find(entity => entity.id === parameters.body_a)
        const entityB = asset.entities.find(entity => entity.id === parameters.body_b)
        // console.log(entityA, entityB)

        let impulseJoint = null
        let jointPositionComputed, anchor1, anchor2, jointAxeComputed, jointDesc
        switch (parameters.type) {
            case 'fixed':
                if (parameters.position) {
                    jointPositionComputed = new THREE.Vector3(
                        parameters.position[0], parameters.position[1], parameters.position[2]
                    )
                }
                else {
                    jointPositionComputed = new THREE.Vector3(0, 0, 0);
                    jointPositionComputed
                        .addVectors(entityA.mesh.position, entityB.mesh.position)
                        .multiplyScalar(0.5)
                }
                anchor1 = entityA.mesh.clone().worldToLocal( jointPositionComputed.clone() )
                anchor2 = entityB.mesh.clone().worldToLocal( jointPositionComputed.clone() )

                jointDesc = RAPIER.JointData.fixed(
                    anchor1,
                    entityA.mesh.clone().quaternion.conjugate(),
                    anchor2,
                    entityB.mesh.clone().quaternion.conjugate()
                )
                impulseJoint = this.physics.createImpulseJoint(
                    jointDesc,
                    entityA.rigidBody,
                    entityB.rigidBody,
                    true
                )
                // console.log(impulseJoint)
                break

            case 'revolute':
                if (parameters.position) {
                    jointPositionComputed = new THREE.Vector3(
                        parameters.position[0], parameters.position[1], parameters.position[2]
                    )
                }
                else {
                    jointPositionComputed = new THREE.Vector3(0, 0, 0);
                    jointPositionComputed
                        .addVectors(entityA.mesh.position, entityB.mesh.position)
                        .multiplyScalar(0.5)
                }
                jointAxeComputed = parameters.axe ?? new THREE.Vector3(1, 0, 0)
                anchor1 = entityA.mesh.clone().worldToLocal( jointPositionComputed.clone() )
                anchor2 = entityB.mesh.clone().worldToLocal( jointPositionComputed.clone() )

                jointDesc = RAPIER.JointData.revolute(
                    anchor1,
                    anchor2,
                    jointAxeComputed
                )
                impulseJoint = this.physics.createImpulseJoint(
                    jointDesc,
                    entityA.rigidBody,
                    entityB.rigidBody,
                    true
                )
                break

            default:
                console.warn('Unknown joint type: ' + parameters.type)
                return null
        }

        switch (parameters.type) {
            case 'fixed':
                return {
                    id: parameters.id,
                    impulseJoint
                }

            case 'revolute':
                impulseJoint.configureMotorVelocity(0, 0)
                return {
                    id: parameters.id,
                    impulseJoint,
                    set targetVelocity(value) {
                        impulseJoint.configureMotorVelocity(value, 0)
                    }
                }

            default:
                console.warn('Unknown joint type: ' + parameters.type)
                return null
        }
    }

    update() {
        for (const asset of this.assets) {
            for (const entity of asset.entities) {
                if (entity.rigidBody !== null) {
                    entity.mesh.position.copy(entity.rigidBody.translation())
                    entity.mesh.quaternion.copy(entity.rigidBody.rotation())
                }
            }
        }
    }

    async loadGLTF(url) {
        const gltfDesc = await this.gltfLoader.loadAsync(url)
        return gltfDesc.scene
    }

    setXray(value) {
        this.xray = value;
        for (const asset of this.assets) {
            for (const entity of asset.entities) {
                if (entity.mesh) {
                    entity.mesh.traverse((child) => {
                        if (child.isMesh) {
                            child.material.transparent = value;
                            child.material.opacity = value ? 0.5 : 1;
                            child.material.needsUpdate = true;
                        }
                    });
                }
            }
        }
    }
}

export class Asset {
    constructor(name) {
        this.name = name
        this.entities = []
        this.joints = []
    }

    #translation = new THREE.Vector3()

    get translation() {
        return this.#translation
    }
    /**
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    translate(x, y, z) {
        const translation = this.#translation.add(new THREE.Vector3(x, y, z))
        // console.log(translation)
        this.#translation = translation;

        for (const entity of this.entities) {
            if (entity.mesh) {
                entity.mesh.position.add(new THREE.Vector3(x, y, z));
            }
            if (entity.rigidBody) {
                entity.rigidBody.setTranslation( new RAPIER.Vector3(
                    entity.rigidBody.translation().x + x,
                    entity.rigidBody.translation().y + y,
                    entity.rigidBody.translation().z + z
                ));
            }
        }
        return this;
    }

    rotate(x, y, z) {
        const euler = new THREE.Euler(x, y, z)
        euler.order = 'YXZ'

        for (const entity of this.entities) {
            const pivot = this.#translation.clone();
            entity.mesh.worldToLocal(pivot);
            entity.mesh.pivot = pivot;
            entity.mesh.applyQuaternion(new THREE.Quaternion().setFromEuler(euler));

            if (entity.rigidBody) {
                const position = entity.mesh.getWorldPosition(new THREE.Vector3());
                entity.rigidBody.setTranslation( position );
                entity.rigidBody.setRotation(entity.mesh.getWorldQuaternion(new THREE.Quaternion()));
                entity.mesh.pivot = null;    // Reset pivot
            }
        }
        return this;
    }
}
