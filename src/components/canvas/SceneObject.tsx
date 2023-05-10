import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useRef, useState, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import { Vector3 } from 'three'
import { sceneObjects } from '@/gallery/sceneObjects'

interface ObjectPropType {
  position: Vector3
  scale: number
  name: string
  type: string
  waypoints?: Array<YUKA.Vector3>
  children?: Array<ObjectPropType>
}

interface PropsObject {
  object: ObjectPropType
  asset: any
}

const satellite = 'satellite'
const planet = 'planet'

/*
 *
 *
 * Can't parallelize the loading of the models with a Promise.all() because we need to use the useGLTF (or any of the other R3F loaders)
 * in order to be able to trigger the suspense fallback.
 *
 * Also unsure why the hooks don't trigger the Suspense boundary on the page component. In theory, it should fallback to that one, but instead we have to add
 * another suspense boundary to the SceneObject component
 *
 *
 *
 * */
const Loader = () => {
  const { progress } = useProgress()

  return (
    <Html center position={[0, 0, 0]} style={{ color: 'black', background: 'white', textAlign: 'center' }}>
      {progress} % loaded
    </Html>
  )
}
export function SceneObject() {
  return (
    <Suspense fallback={<Loader />}>
      {sceneObjects.map((asset, i) => {
        const object = sceneObjects[i]
        if (object.type === 'ship') {
          return <AnimatedChild key={object.name} object={object} asset={asset} />
        }
        return <Child key={object.name} object={object} asset={asset} />
      })}
    </Suspense>
  )
}

const Child = ({ object }: PropsObject) => {
  const { position, scale, name, type } = object
  const gltf = useGLTF(`/${name}.glb`)

  const objectRef = useRef(null)
  //we return the children as a group bceause it anchors the loading state HTML to world [0,0,0]. Othewise the div will drift with the meshes
  return (
    <group position={[0, 0, 0]}>
      <primitive key={object.name} ref={objectRef} position={position} object={gltf.scene} scale={scale}>
        {object.children.map((child, i) => {
          const childObject = object.children[i]
          return <Child key={child.name} object={childObject} asset={object} />
        })}
      </primitive>
    </group>
  )
}
/*
 * TODO:
 * Array<YUKA Vector>Yuka vectors as props
 * Chase followPathBehavior
 *
 */
const AnimatedChild = ({ object }: PropsObject) => {
  const { position, scale, name, waypoints, type } = object
  const gltf = useGLTF(`/${name}.glb`)

  const vehicleMesh = useRef(null)
  const [entityManager, setEntityManager] = useState(new YUKA.EntityManager())
  useEffect(() => {
    if (!vehicleMesh) {
      return
    }
    let vehicle = new YUKA.Vehicle()
    vehicle.maxSpeed = 50
    vehicleMesh.current.matrixAutoUpdate = false
    vehicle.setRenderComponent(vehicleMesh.current, sync)

    const path = new YUKA.Path()
    waypoints.forEach((waypoint) => {
      path.add(waypoint)
    })
    // path.add(new YUKA.Vector3(-10, -45, 40))
    // path.add(new YUKA.Vector3(-60, 12, 0))
    // path.add(new YUKA.Vector3(-40, -30, -40))
    // path.add(new YUKA.Vector3(0, -80, -20))
    // path.add(new YUKA.Vector3(60, 90, 0))
    // path.add(new YUKA.Vector3(40, 100, 40))
    // path.add(new YUKA.Vector3(0, 10, 60))
    if (waypoints.length > 0) {
      path.loop = true

      vehicle.position.copy(path.current())
      const followPathBehavior = new YUKA.FollowPathBehavior(path, 1)
      vehicle.steering.add(followPathBehavior)
      entityManager.add(vehicle)
    }

    function sync(entity, renderComponent) {
      renderComponent.matrix.copy(entity.worldMatrix)
    }
  })

  useFrame((state, delta) => {
    entityManager.update(delta)
  })

  return (
    <primitive key={object.name} ref={vehicleMesh} position={position} object={gltf.scene} scale={scale}></primitive>
  )
}
