import * as THREE from 'three'
import { useRef, useEffect, useState, Suspense } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector3 } from 'three'
import { sceneObjects } from '@/gallery/sceneObjects'
interface ObjectPropType {
  position: Vector3
  scale: number
  name: string
  type: string
  children: Array<ObjectPropType>
}

interface PropsObject {
  object: ObjectPropType
  asset: any
}

const satellite = 'satellite'
const planet = 'planet'

const Loader = () => {
  const { progress } = useProgress()
  return (
    <Html fullscreen style={{ color: 'black', background: 'white', textAlign: 'center' }}>
      {progress} % loaded
    </Html>
  )
}
export function SceneObject() {
  return (
    <Suspense fallback={<Loader />}>
      {sceneObjects.map((asset, i) => {
        const object = sceneObjects[i]
        return <Child key={object.name} object={object} asset={asset} />
      })}
    </Suspense>
  )
}

const Child = ({ object }: PropsObject) => {
  const { position, scale, name, type } = object
  const gltf = useGLTF(`/${name}.glb`)

  const objectRef = useRef(null)

  return <primitive key={object.name} ref={objectRef} position={position} object={gltf.scene} scale={scale}></primitive>
}
