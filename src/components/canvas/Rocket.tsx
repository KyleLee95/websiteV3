import { useRef, useEffect } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

//Some helpers to get the camera working correctly
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
  const three = useThree()
  const { clock } = three
  const elapsedTime = clock.elapsedTime
  const currPosition = new THREE.Vector3()
  const currLookAt = new THREE.Vector3()

  const [subscribeKeys, getKeys] = useKeyboardControls()

  useEffect(() => {
    //rotate the rocket so that it's sideways
    rocketGroup.current.rotation.set(-1.5, 0, 0)
  }, [rocketGroup, rocket])

  useFrame((state, delta) => {
    const { forward, left, right } = getKeys()
    if (forward) {
      rocketGroup.current.translateY(0.5)
    }
    if (left) {
      const angleOfRotation = Math.PI / 100
      rocketGroup.current.rotateZ(angleOfRotation)
    }
    if (right) {
      const angleOfRotation = -Math.PI / 100
      rocketGroup.current.rotateZ(angleOfRotation)
    }
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
    <group ref={rocketGroup}>
      <primitive ref={rocket} position={[0, 0, 0]} object={gltf.scene} scale={1}></primitive>
    </group>
  )
}
