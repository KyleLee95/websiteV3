import * as THREE from 'three'
import { Vector3 } from '@react-three/fiber'

const Ring = (props) => {
  const { position } = props
  return (
    <mesh position={position}>
      <torusGeometry />
      <meshBasicMaterial color='orange' />
    </mesh>
  )
}

export const RingChallenge = () => {
  const ringPositions: Array<Vector3> = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(20, 0, 25),
    new THREE.Vector3(5, 0, 15),
    new THREE.Vector3(-10, 0, 5),
    new THREE.Vector3(-5, 0, 5),
  ]
  return ringPositions.map((pos, i) => {
    return <Ring key={i} position={pos} />
  })
}
