import { useRef, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector3 } from 'three'
interface PlanetPropType {
  position: Vector3
  scale: number
  planet: string
}
export function Planet(props: PlanetPropType) {
  const { position, scale, planet } = props
  const gltf = useLoader(GLTFLoader, `/${planet}.glb`)
  return <primitive position={position} object={gltf.scene} scale={scale} />
}
