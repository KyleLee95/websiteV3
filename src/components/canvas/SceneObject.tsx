import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useRef, useState, useEffect, Suspense, Ref, KeyboardEventHandler } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import { Vector3 } from 'three'
import { sceneObjects } from '@/gallery/sceneObjects'
import { useSphere, useBox, usePlane } from '@react-three/cannon'
import { win32 } from 'path'
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
  parent?: ObjectPropType
  asset: any
}

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

const planet = 'planet'
const satellite = 'satellite'
const ship = 'ship'
const icon = 'icon'
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
        if (object.type === ship) {
          return <AnimatedChild key={object.name} object={object} asset={asset} />
        } else if (object.type === icon) {
          return <InteractiveChild key={object.name} object={object} asset={asset} />
        } else {
          return <Child key={object.name} object={object} asset={asset} />
        }
      })}
    </Suspense>
  )
}
const zOffset = 2
const yOffset = 1
const planeWidth = 3
const planeDepth = 5
const handleZoneGoTo = (event, name: string) => {
  console.log(event)
  console.log('name', name)
  if (event.key !== 'Enter') return
  if (name === 'github') {
    window.open('github.com/kylelee95')
  } else if (name === 'linkedin') {
    window.open('https://www.linkedin.com/in/kyle-lee-7b39ab1a6/')
  } else if (name === 'emai') {
    window.open(`mailto:kyle@kylelee.dev?Subject='hello!'`)
  }
}
const InteractiveZone = (props: any) => {
  const { position, networkRef, asset, name } = props
  const zoneMesh = useRef(null)
  const [showZone, setShowZone] = useState(false)
  const [zone, zoneAPI] = useBox(() => ({
    args: [2, 2, 10],
    position: [position.x, position.y, position.z + zOffset],
    type: 'Kinematic',
    isTrigger: true,
    onCollide: () => {
      setShowZone(true)
    },
    onCollideEnd: () => {
      setShowZone(false)
    },
  }))

  useFrame((state, delta) => {
    if (showZone) {
      networkRef.current.rotation.y += delta
    }
  })
  return (
    <>
      {showZone ? (
        <Html position={position} style={{ background: 'white' }}>
          {' '}
          Press Enter
        </Html>
      ) : null}
    </>
  )
}

const InteractiveChild = ({ object }: PropsObject) => {
  const { position, scale, name } = object
  const gltf = useGLTF(`/${name}.glb`)
  const objectRef = useRef(null)

  const [box, boxAPI] = useBox(() => ({
    position: [position.x, position.y, position.z],
    args: [2, 2, 2],
  }))

  return (
    <>
      <primitive position={position} key={object.name} ref={objectRef} object={gltf.scene} scale={scale} />
      <InteractiveZone position={position} name={name} networkRef={objectRef} />
    </>
  )
}

const Child = ({ object }: PropsObject) => {
  const { position, scale, name, type } = object
  const gltf = useGLTF(`/${name}.glb`)
  const objectRef = useRef(null)
  let args
  if (type === satellite) {
    args = [10, 10, 10]
  } else if (type === planet) {
    args = [20, 20, 20]
  } else {
    args = [1, 1, 1]
  }

  const [box, boxAPI] = useBox(() => ({
    args,
    position: [position.x, position.y, position.z],
  }))
  useEffect(() => {}, [boxAPI])
  useFrame((state, delta) => {
    if (type === planet) {
      objectRef.current.rotation.y += delta / 30
    }
  })
  return (
    <>
      <primitive position={position} key={object.name} ref={objectRef} object={gltf.scene} scale={scale}>
        {object.children.map((child, i) => {
          const childObject = object.children[i]
          return <Child key={child.name} object={childObject} asset={object} />
        })}
      </primitive>
    </>
  )
}

const AnimatedChild = ({ object, parent }: PropsObject) => {
  const { position, scale, name, waypoints, type } = object
  const gltf = useGLTF(`/${name}.glb`)

  const vehicleMesh = useRef(null)
  const [entityManager, setEntityManager] = useState(new YUKA.EntityManager())
  const [yukaVehicle, setYukaVehicle] = useState(new YUKA.Vehicle())
  useEffect(() => {
    //early return if the ref hasn't been set yet
    if (!vehicleMesh) {
      return
    }

    //handle cases with custom behavior
    if (name === 'mandalorian') {
      vehicleMesh.current.children[0].rotateZ(-Math.PI / 2)
    }
    if (parent) {
      vehicleMesh.current.matrixAutoUpdate = false
      yukaVehicle.maxSpeed = 50
      yukaVehicle.position.z = -5
      yukaVehicle.setRenderComponent(vehicleMesh.current, sync)
      const pursuitBehavior = new YUKA.PursuitBehavior(parent, 2)
      yukaVehicle.steering.add(pursuitBehavior)

      entityManager.add(yukaVehicle)
    } else if (waypoints.length > 0) {
      yukaVehicle.maxSpeed = 50
      vehicleMesh.current.matrixAutoUpdate = false
      yukaVehicle.setRenderComponent(vehicleMesh.current, sync)

      const path = new YUKA.Path()
      waypoints.forEach((waypoint) => {
        path.add(waypoint)
      })
      path.loop = true

      yukaVehicle.position.copy(path.current())

      const followPathBehavior = new YUKA.FollowPathBehavior(path, 1)
      yukaVehicle.steering.add(followPathBehavior)
      entityManager.add(yukaVehicle)
    }

    function sync(entity, renderComponent) {
      renderComponent.matrix.copy(entity.worldMatrix)
    }
  })

  useFrame((state, delta) => {
    entityManager.update(delta)
  })

  return (
    <group>
      <primitive key={object.name} ref={vehicleMesh} position={position} object={gltf.scene} scale={scale}></primitive>
      {object.children.map((child) => {
        //pass the instace of the yuka vehicle to the child so that it can be pursued.
        //TODO: Should also pass a boolean to state that it should be a pursuit or not
        return <AnimatedChild parent={yukaVehicle} key={object.name} object={child} asset={child} />
      })}
    </group>
  )
}
