import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
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

async function loadSceneAssets(sceneAssetsToLoad: Array<Promise<Object>>, setter: Function) {
  const sceneAssets = await Promise.all(sceneAssetsToLoad)
  setter(sceneAssets)
  return sceneAssets
}
export function SceneObject() {
  const [assets, setAssets] = useState(null)
  useEffect(() => {
    const sceneAssetsToLoad = sceneObjects.map((object) => {
      const loader = new GLTFLoader()
      const sceneAssetsPromises = loader.loadAsync(`/${object.name}.glb`)
      return sceneAssetsPromises
    })
    loadSceneAssets(sceneAssetsToLoad, setAssets)
  }, [])

  if (!assets) {
    console.log('ran')
    return (
      <Html center style={{ color: 'black', background: 'white' }}>
        Loading...
      </Html>
    )
  }
  return assets.map((asset, i) => {
    const object = sceneObjects[i]
    return <Child key={object.name} object={object} asset={asset} />
  })
}

const Child = ({ object, asset }: PropsObject) => {
  const { position, scale, name, type } = object
  const { scene } = asset
  // const gltf = useLoader(GLTFLoader, `/${name}.glb`)

  const objectRef = useRef(null)

  // useFrame((state, delta) => {
  //   if (type === planet) {
  //     const object = objectRef.current
  //     object.rotation.y += 0.001
  //   }
  //   if (type === satellite) {
  //     const object = objectRef.current
  //     object.rotation.y += 0.01
  //   }
  // })

  return <primitive key={object.name} ref={objectRef} position={position} object={scene} scale={scale}></primitive>
}
