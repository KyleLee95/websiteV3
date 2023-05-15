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
  const idealOffset = new THREE.Vector3(0, 55, 70)
  idealOffset.applyEuler(rotation)
  idealOffset.add(position)
  return idealOffset
}

export function Rocket() {
  const rocketGroup = useRef(null)
  const rocket = useRef(null)
  const rigidBody = useRef(null)
  const collider = useRef(null)
  const { clock } = useThree()
  const elapsedTime = clock.elapsedTime
  const currPosition = new THREE.Vector3()
  const currLookAt = new THREE.Vector3()

  const rapier = useRapier()

  const [subscribeKeys, getKeys] = useKeyboardControls()
  // //init controller
  useEffect(() => {
    rocket.current.rotateX(-Math.PI / 2)
  }, [rapier])

  useFrame((state, delta) => {
    const { forward, left, right } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    if (forward) {
      rigidBody.current.setRotation({ w: 1, x: 0, y: 0, z: 0 }, true)
      // console.log(rigidBody.current.rotation)
    }
    if (left) {
      // rocketGroup.current.rotateY(Math.PI / 100)
      rigidBody.current.setAngvel({ x: 0.0, y: 1, z: 0.0 })
      //      rigidBody.current.setRotation({ w: 1, x: 0, y: 0, z: -1 }, true)
    }
    if (right) {
      // rocketGroup.current.rotateY(-Math.PI / 100)

      rigidBody.current.setRotation({ w: 1, x: 0, y: 0, z: 1 }, true)
    }

    rigidBody.current.applyImpulse({ x: 0.0, y: 0.0, z: -1.0 }, true)
  })

  //chase camera
  useFrame((state, delta) => {
    const group = rocketGroup.current
    rocket.current.rotation.y += delta //rotate the rocket for cool animation
    const idealOffset = calculateIdealOffset(group.rotation, group.position)
    const idealLookAt = calculateIdealLookAt(group.rotation, group.position)
    //lerping makes camera movement independent of the frame rate
    const lerpSmoothingCoefficient = Math.pow(0.001, elapsedTime)
    currPosition.lerp(idealOffset, lerpSmoothingCoefficient)
    currLookAt.lerp(idealLookAt, lerpSmoothingCoefficient)
    state.camera.position.copy(currPosition)
    state.camera.lookAt(currLookAt)
  })

  const gltf = useLoader(GLTFLoader, '/rocket.glb')

  return (
    <RigidBody ref={rigidBody} enabledRotations={[false, false, false]}>
      <CuboidCollider
        args={[2, 1, 1]}
        ref={collider}
        sensor
        onCollisionEnter={() => {
          console.log('contact')
        }}
      />
      <mesh ref={rocketGroup}>
        <primitive ref={rocket} position={[0, 0, 0]} object={gltf.scene} scale={1}></primitive>
      </mesh>
    </RigidBody>
  )
}
