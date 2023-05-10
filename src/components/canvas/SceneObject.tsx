import * as THREE from 'three'
import { Suspense, useRef, useEffect } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector3 } from 'three'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import { sceneObjects } from '@/gallery/sceneObjects'
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

interface SceneObjectType {
  name: string
  position: Vector3
  scale: number
  type: string
  children: Array<SceneObjectType>
}
const satellite = 'satellite'
const planet = 'planet'

export function SceneObject() {
  return sceneObjects.map((object) => {
    return <Child key={object.name} object={object} />
  })
}

const Child = ({ object }) => {
  const { position, scale, name, children, type } = object
  const gltf = useLoader(GLTFLoader, `/${name}.glb`)

  const objectRef = useRef(null)

  useFrame((state, delta) => {
    if (type === planet) {
      const object = objectRef.current
      object.rotation.y += 0.001
    }
    if (type === satellite) {
      const object = objectRef.current
      object.rotation.y += 0.01
    }
  })

  return <primitive key={object.name} ref={objectRef} position={position} object={gltf.scene} scale={scale}></primitive>
}
