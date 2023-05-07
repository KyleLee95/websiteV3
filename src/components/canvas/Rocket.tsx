import { useRef, useEffect, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import * as THREE from 'three'
export function Rocket() {
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
  const rocketGroup = useRef(null)
  const rocket = useRef(null)
  const camera = useRef(null)

  useEffect(() => {
    rocketGroup.current.rotation.set(-1.5, 0, 0)
    document.addEventListener('keydown', (e) => {
      const rocket = rocketGroup.current
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
  }, [rocketGroup])

  useFrame((state, delta) => {
    const rocketPosition = rocketGroup.current.position
    rocket.current.rotation.y += delta

    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(rocketPosition)
    cameraPosition.z += 10.25
    cameraPosition.y += 3.65

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(rocketPosition)
    cameraTarget.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)
  })
  const gltf = useLoader(GLTFLoader, '/rocket.glb')

  return (
    <group ref={rocketGroup}>
      <primitive ref={rocket} position={[0, 0, 0]} object={gltf.scene} scale={1} />
    </group>
  )
}
