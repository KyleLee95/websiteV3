import { useRef, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Group } from 'three'

export function Rocket() {
  const rocketRef = useRef(null)
  useEffect(() => {
    console.log(rocketRef.current.rotation)
    rocketRef.current.rotation.set(-1.5, 0, 0)

    document.addEventListener('keydown', (e) => {
      console.log('e', e)
      const keyCode = e.which
      // up
      if (keyCode == 38) {
        rocketRef.current.position.z -= 0.01
        // down
      } else if (keyCode == 40) {
        rocketRef.current.position.z += 0.01
        // left
      } else if (keyCode == 37) {
        rocketRef.current.position.x -= 0.01
        // right
      } else if (keyCode == 39) {
        rocketRef.current.position.x += 0.01
        // space
      } else if (keyCode == 32) {
        rocketRef.current.position.x = 0.0
        rocketRef.current.position.y = 0.0
      }
    })
  }, [rocketRef])

  const gltf = useLoader(GLTFLoader, '/rocket.glb')
  return <primitive ref={rocketRef} position={[1, 1, 1]} object={gltf.scene} scale={0.09} />
}
