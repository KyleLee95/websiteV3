import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { useEffect, useRef } from 'react'
import { Vector3 } from '@react-three/fiber'
import { useTrimesh, useConvexPolyhedron, Triplet } from '@react-three/cannon'
function CreateTrimesh(geometry: THREE.BufferGeometry) {
  const vertices = (geometry.attributes.position as THREE.BufferAttribute).array
  const indices = Object.keys(vertices).map(Number)
  return new CANNON.Trimesh(vertices as [], indices)
}

const Ring = (props) => {
  const { position } = props
  const ringMesh = useRef(null)
  //TODO: improve this
  //essentially, make the mesh we want and feed it into the triMesh hook so that we can a bespoke collider
  //
  const geometry = new THREE.TorusGeometry(10, 2, 30, 100)
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'orange' }))
  // the use - cannon hooks implicitly return the colliders
  // const colliderPosition: Triplet = [position.x, position.y, position.z]
  // const [ring, ringAPI] = useTrimesh(() => ({
  //   args: [verticies, indices],
  // }))
  useEffect(() => {
    if (!ringMesh.current) return
    const torusShape = CreateTrimesh(ringMesh.current.geometry)
  }, [ringMesh])
  return (
    <mesh ref={ringMesh} scale={0.1} position={position}>
      <torusGeometry args={[10, 2, 3, 100]} />

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
