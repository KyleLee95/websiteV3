import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector3 } from 'three'

interface ObjectPropType {
  position: Vector3
  scale: number
  name: string
  type: string
  children: Array<ObjectPropType>
}

interface Object {
  object: ObjectPropType
}

const satellite = 'satellite'
const planet = 'planet'
export function SceneObject({ object }: Object) {
  const { position, scale, name, children, type } = object
  const gltf = useLoader(GLTFLoader, `/${name}.glb`)
  const objectRef = useRef(null)

  useEffect(() => {}, [objectRef])

  useFrame((state, delta) => {
    if (object.type === planet) {
      const object = objectRef.current
      object.rotation.y += 0.001
    }
    if (object.type === satellite) {
      const object = objectRef.current
      object.rotation.y += 0.01
    }
  })
  return (
    <primitive ref={objectRef} position={position} object={gltf.scene} scale={scale}>
      {children.map((child) => {
        return <SceneObject key={child.name} object={child} />
      })}
    </primitive>
  )
}
