import { useRef, useEffect, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'

const calculateIdealLookAt = (rotation: THREE.Euler, position: THREE.Vector3) => {
  const idealLookAt = new THREE.Vector3(0, 0, 0)
  idealLookAt.applyEuler(rotation)
  idealLookAt.add(position)
  return idealLookAt
}
const calculateIdealOffset = (rotation: THREE.Euler, position: THREE.Vector3) => {
  const idealOffset = new THREE.Vector3(0, -75, 70)
  idealOffset.applyEuler(rotation)
  idealOffset.add(position)
  return idealOffset
}

export function Rocket() {
  const rocketGroup = useRef(null)
  const rocket = useRef(null)

  const currPosition = new THREE.Vector3()
  const currLookAt = new THREE.Vector3()
  useEffect(() => {
    rocketGroup.current.rotation.set(-1.5, 0, 0)
    document.addEventListener('keydown', (e) => {
      const keyCode = e.which
      // up
      if (keyCode == 38) {
        rocketGroup.current.translateY(0.5)
        // down
      } else if (keyCode == 40) {
        rocketGroup.current.translateY(-0.5)
        // left
      } else if (keyCode == 37) {
        const angleOfRotation = Math.PI / 100
        rocketGroup.current.rotateZ(angleOfRotation)
        // right
      } else if (keyCode == 39) {
        const angleOfRotation = -Math.PI / 100
        rocketGroup.current.rotateZ(angleOfRotation)
        // space
      } else if (keyCode == 32) {
        rocketGroup.current.position.x = 0.0
        rocketGroup.current.position.y = 0.0
      }
    })
  }, [rocketGroup, rocket])

  //chase camera
  useFrame((state, delta) => {
    const group = rocketGroup.current

    rocket.current.rotation.y += delta //rotate the rocket for cool animation
    const idealOffset = calculateIdealOffset(group.rotation, group.position)
    const idealLookAt = calculateIdealLookAt(group.rotation, group.position)
    currPosition.copy(idealOffset)
    currLookAt.copy(idealLookAt)
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
