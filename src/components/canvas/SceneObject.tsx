import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useRef, useState, useEffect, Suspense, Ref } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import { Vector3 } from 'three'
import { sceneObjects } from '@/gallery/sceneObjects'
import { argv0 } from 'process'

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
  rocketBB?: Ref<THREE.Mesh>
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
export function SceneObject(props) {
  const { rocketBB } = props
  return (
    <Suspense fallback={<Loader />}>
      {sceneObjects.map((asset, i) => {
        const object = sceneObjects[i]
        if (object.type === 'ship') {
          return <AnimatedChild key={object.name} object={object} asset={asset} />
        }
        return <Child rocketBB={rocketBB} key={object.name} object={object} asset={asset} />
      })}
    </Suspense>
  )
}

const Child = ({ object, rocketBB }: PropsObject) => {
  const { position, scale, name, type } = object
  const gltf = useGLTF(`/${name}.glb`)
  const objectRef = useRef(null)
  const childBB = useRef(null)
  const childBox = new THREE.Box3()
  let box = new THREE.Box3()
  // useEffect(() => {
  //   if (rocketBB.current) {
  //     rocketBB.current.geometry.computeBoundingBox()
  //
  //     childBB.current.geometry.computeBoundingBox()
  //   }
  // }, [rocketBB])
  useFrame((state, delta) => {
    //add a nice little rotation for each planet
    // rocketBB.current.geometry.computeBoundingBox()
    //
    // childBB.current.geometry.computeBoundingBox()
    // if (type === planet) {
    //   objectRef.current.rotation.y += delta / 30
    // }
    //
    // if (rocketBB.current.geometry.boundingBox) {
    //   box.copy(rocketBB.current.geometry.boundingBox).applyMatrix4(rocketBB.current.matrixWorld)
    //
    //   childBox.copy(childBB.current.geometry.boundingBox).applyMatrix4(childBB.current.matrixWorld)
    // }
    //
    // //if it intersects
    // const intersects = box.intersectsBox(childBox)
    // console.log('intersects', intersects)
    // if (intersects) {
    //   console.log(childBB.current)
    //   childBB.current.material.color = new THREE.Color(1, 0, 0)
    // } else {
    //   childBB.current.material.color = new THREE.Color(0, 0, 1)
    // }
  })

  //we return the children as a group bceause it anchors the loading state HTML to world [0,0,0]. Othewise the div will drift with the meshes
  return (
    <>
      <primitive position={position} key={object.name} ref={objectRef} object={gltf.scene} scale={scale}>
        {object.children.map((child, i) => {
          const childObject = object.children[i]
          return <Child rocketBB={rocketBB} key={child.name} object={childObject} asset={object} />
        })}
      </primitive>
    </>
  )
}

// <mesh position={position} ref={childBB} scale={1}>
//
//   <meshBasicMaterial color={'blue'} transparent={true} opacity={0.5} />
//   <boxGeometry args={[20, 20, 20]}></boxGeometry>
// </mesh>
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

// <mesh>
//   <boxGeometry args={[5, 5, 5]} />
//   <meshBasicMaterial color='blue' />
// </mesh>
