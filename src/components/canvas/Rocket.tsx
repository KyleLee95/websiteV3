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
  useEffect(() => {
    rocket.current.rotateX(-Math.PI / 2)
  }, [rapier])

  useFrame((state, delta) => {
    const { forward, left, right } = getKeys()
    try {
      if (forward) {
        rocketGroup.current.translateZ(-0.5)
        rigidBody.current.setTranslation(rocketGroup.current.position, true)
      }
      if (left) {
        rocketGroup.current.rotateY(Math.PI / 100)
      }
      if (right) {
        rocketGroup.current.rotateY(-Math.PI / 100)
      }
    } catch (err) {}
  })

  const gltf = useLoader(GLTFLoader, '/rocket.glb')

  return (
    <RigidBody ref={rigidBody} args={[1, 1, 1]} colliders='cuboid' type='dynamic'>
      <group ref={rocketGroup}>
        <primitive ref={rocket} position={[0, 0, 0]} object={gltf.scene} scale={1}></primitive>
      </group>
    </RigidBody>
  )
}
