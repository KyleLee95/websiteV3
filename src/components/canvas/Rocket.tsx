import { useRef, useEffect } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { CuboidCollider, RigidBody, RapierCollider, useRapier, quat, vec3, euler } from '@react-three/rapier'
import { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import { random16 } from 'three/src/math/MathUtils'
//Some helpers to get the camera working correctly

const MOVEMENT_SPEED = 10
const calculateIdealLookAt = (rotation: THREE.Euler, position: THREE.Vector3) => {
  const idealLookAt = new THREE.Vector3(2, 2, 2)
  idealLookAt.applyEuler(rotation)
  idealLookAt.add(position)
  return idealLookAt
}
const calculateIdealOffset = (rotation: THREE.Euler, position: THREE.Vector3) => {
  const idealOffset = new THREE.Vector3(0, -55, 70)
  idealOffset.applyEuler(rotation)
  idealOffset.add(position)
  return idealOffset
}

export function Rocket() {
  const rocketGroup = useRef(null)
  const rocket = useRef(null)
  const rigidBody = useRef(null)
  const three = useThree()

  const refState = useRef({
    grounded: false,
    jumping: false,
    velocity: vec3(),
  })
  const controller = useRef<KinematicCharacterController>()
  const rapier = useRapier()

  const collider = useRef<RapierCollider>(null)
  const [subscribeKeys, getKeys] = useKeyboardControls()
  // //init controller
  // useEffect(() => {
  //   const c = rapier.world.raw().createCharacterController(0.1)
  //   c.setApplyImpulsesToDynamicBodies(true)
  //   c.setCharacterMass(0.2)
  //   c.enableSnapToGround(0.02)
  //   controller.current = c
  //   rocket.current.rotateX(-Math.PI / 2)
  // }, [rapier])

  useFrame((state, delta) => {
    const { forward, left, right } = getKeys()
    try {
      // const position = vec3(rigidBody.current.translation())
      // const rotation = quat(rigidBody.current.rotation())
      // const eulerRot = euler().setFromQuaternion(quat(rigidBody.current.rotation()))
      // const idealLookAt = calculateIdealLookAt(eulerRot, position)
      // const idealOffset = calculateIdealOffset(eulerRot, position)
      // const movement = vec3()

      const impulse = { x: 0, y: 0, z: 0 }
      const torque = { x: 0, y: 0, z: 0 }
      let rotate = false
      const impulseStrength = 3
      const torqueStrength = 0.2 * delta
      if (forward) {
        impulse.z -= impulseStrength
        rotate = true
        console.log('here')
      }
      if (left) {
        impulse.x -= impulseStrength
        rotate = true
      }
      if (right) {
        impulse.x += impulseStrength
        rotate = true
      }

      rigidBody.current.applyImpulse(impulse)
      // movement.add(velocity)
      // controller.current.computeColliderMovement(collider.current, movement)
      // refState.current.grounded = controller.current.computedGrounded()
      // let correctedMovement = controller.current.computedMovement()
      // position.add(vec3(correctedMovement))
      // rigidBody.current.setNextKinematicTranslation(position)
      // rigidBody.current.setNextKinematicRotation(rotation)
      //      console.log(rigidBody.current.linvel())
      if (rotate) {
        const linvel = rigidBody.current.linvel()
        const angle = Math.atan2(linvel.x, linvel.z)
        rigidBody.current.rotation.y = angle
      }
    } catch (err) {}
  })

  const gltf = useLoader(GLTFLoader, '/rocket.glb')

  return (
    <RigidBody ref={rigidBody} colliders='cuboid'>
      <group ref={rocketGroup}>
        <primitive ref={rocket} position={[0, 0, 0]} object={gltf.scene} scale={1}></primitive>
      </group>
    </RigidBody>
  )
}
