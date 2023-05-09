import * as THREE from 'three'
import { Suspense, useRef, useEffect, useState } from 'react'
import { useLoader, useFrame, render } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector3 } from 'three'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import * as YUKA from 'yuka'
import { argv0 } from 'process'
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
const sceneObjects: SceneObjectType[] = [
  {
    name: 'dione',
    position: new THREE.Vector3(50, 5, 0),
    scale: 0.015,
    type: 'planet',
    children: [{ name: 'tgo', position: new THREE.Vector3(2000, 0, 0), scale: 55, type: 'satellite', children: [] }],
  },
  { name: 'itokawa', position: new THREE.Vector3(-30, 0, -30), scale: 0.0025, type: 'satellite', children: [] },
  {
    name: 'titan',
    position: new THREE.Vector3(-100, 0, 0),
    scale: 0.015,
    type: 'planet',
    children: [],
  },
  { name: 'sun', position: new THREE.Vector3(10, 0, -35), scale: 0.025, type: 'planet', children: [] },
  { name: 'juno', position: new THREE.Vector3(0, 0, -55), scale: 0.025, type: 'planet', children: [] },
  { name: 'saturn', position: new THREE.Vector3(20, 0, 105), scale: 0.025, type: 'planet', children: [] },
  { name: 'rhea', position: new THREE.Vector3(-100, 0, -300), scale: 0.025, type: 'planet', children: [] },
  { name: 'uranus', position: new THREE.Vector3(-100, 0, 100), scale: 0.025, type: 'planet', children: [] },
  {
    name: 'earth',
    position: new THREE.Vector3(-50, 0, -75),
    scale: 0.025,
    type: 'planet',
    children: [{ name: 'iss', position: new THREE.Vector3(-2000, 0, -75), scale: 3, type: 'satellite', children: [] }],
  },

  {
    name: 'swordfish',
    position: new THREE.Vector3(-50, 0, 70),
    scale: 1,
    type: 'ship',
    children: [{ name: 'redtail', position: new THREE.Vector3(-10, 0, 10), scale: 1, type: 'ship', children: [] }],
  },

  {
    name: 'mandalorian',
    position: new THREE.Vector3(30, 0, 70),
    scale: 1,
    type: 'ship',
    children: [{ name: 'tiefighter', position: new THREE.Vector3(30, 0, 10), scale: 1, type: 'ship', children: [] }],
  },
]
export const YukaVehicle = () => {
  const vehicleMesh = useRef(null)
  const [entityManager, setEntityManager] = useState(new YUKA.EntityManager())
  useEffect(() => {
    if (!vehicleMesh) {
      return
    }
    let vehicle = new YUKA.Vehicle()
    vehicle.maxSpeed = 10
    vehicleMesh.current.matrixAutoUpdate = false
    vehicle.setRenderComponent(vehicleMesh.current, sync)

    const path = new YUKA.Path()
    path.add(new YUKA.Vector3(-10, 0, 40))
    path.add(new YUKA.Vector3(-60, 0, 0))
    path.add(new YUKA.Vector3(-40, 0, -40))
    path.add(new YUKA.Vector3(0, 0, 0))
    path.add(new YUKA.Vector3(60, 0, 0))
    path.add(new YUKA.Vector3(40, 0, 40))
    path.add(new YUKA.Vector3(0, 0, 60))

    path.loop = true
    vehicle.position.copy(path.current())
    const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5)
    vehicle.steering.add(followPathBehavior)
    entityManager.add(vehicle)

    function sync(entity, renderComponent) {
      renderComponent.matrix.copy(entity.worldMatrix)
    }
  })

  useFrame((state, delta) => {
    entityManager.update(delta)
  })
  return (
    <mesh ref={vehicleMesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={'orange'} />
    </mesh>
  )
}
