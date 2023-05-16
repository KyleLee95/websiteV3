import { useRef, useEffect } from 'react'
import { useRaycastVehicle, useBox } from '@react-three/cannon'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useWheels } from './useWheels'
import { useControls } from './useControls'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
export const TestBox = (thirdPerson) => {
  const [box, boxAPI] = useBox(
    () => ({
      args: [2, 2, 2],
      position: [0, 5, 0],
      mass: 1,
    }),
    useRef(),
  )

  const position = [-1.5, 0.5, 3]
  const width = 0.15
  const height = 0.07
  const front = 0.15
  const wheelRadius = 0.05

  const chassisBodyArgs = [width, height, front * 2]
  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      args: chassisBodyArgs,
      mass: 150,
      position,
    }),
    useRef(null),
  )

  const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius)

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    useRef(null),
  )

  useControls(vehicleApi, chassisApi)
  const [subscribeKeys, getKeys] = useKeyboardControls()

  // const movement = { forward: 0, strafe: 0, pitch: 0, yaw: 0 }
  // const { forward, strafe, pitch, yaw } = movement
  // useFrame((state, delta) => {
  //   const { up, left, right } = getKeys()
  //   if (up) {
  //     const angle = Math.PI // rotate 90 degrees
  //     const axis = new CANNON.Vec3(0, 1, 0) // rotate around the Y-axis
  //
  //     // Create a quaternion representing the rotation
  //     const quaternion = new CANNON.Quaternion()
  //     quaternion.setFromAxisAngle(axis, angle)
  //
  //     // Set the rotation of the body
  //     boxAPI.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
  //     box.quaternion.copy(new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w))
  //   }
  //   if (left) {
  //     const angle = -Math.PI / 2 // rotate 90 degrees
  //     const axis = new CANNON.Vec3(0, 1, 0) // rotate around the Y-axis
  //
  //     // Create a quaternion representing the rotation
  //     const quaternion = new CANNON.Quaternion()
  //     quaternion.setFromAxisAngle(axis, angle)
  //
  //     // Set the rotation of the body
  //     boxAPI.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
  //     box.quaternion.copy(new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w))
  //     const impulse = new CANNON.Vec3(-10 * delta, 0, 0)
  //     boxAPI.applyImpulse([-1, 0, 0], [1, 1, 0])
  //   }
  //   if (right) {
  //     const angle = Math.PI / 2 // rotate 90 degrees
  //     const axis = new CANNON.Vec3(0, 1, 0) // rotate around the Y-axis
  //
  //     // Create a quaternion representing the rotation
  //     const quaternion = new CANNON.Quaternion()
  //     quaternion.setFromAxisAngle(axis, angle)
  //
  //     // Set the rotation of the body
  //     boxAPI.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
  //     box.quaternion.copy(new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w))
  //   }
  // })

  useFrame((state) => {
    if (!thirdPerson) return

    let position = new THREE.Vector3(0, 0, 0)
    position.setFromMatrixPosition(chassisBody.current.matrixWorld)

    let quaternion = new THREE.Quaternion(0, 0, 0, 0)
    quaternion.setFromRotationMatrix(chassisBody.current.matrixWorld)

    let wDir = new THREE.Vector3(0, 0, 1)
    wDir.applyQuaternion(quaternion)
    wDir.normalize()

    let cameraPosition = position.clone().add(wDir.clone().multiplyScalar(1).add(new THREE.Vector3(0, 0.3, 0)))

    wDir.add(new THREE.Vector3(0, 0.2, 0))
    state.camera.position.copy(cameraPosition)
    state.camera.lookAt(position)
  })

  // useEffect(() => {
  //   if (!result) return
  //
  //   let mesh = result
  //   mesh.scale.set(0.0012, 0.0012, 0.0012)
  //
  //   mesh.children[0].position.set(-365, -18, -67)
  // }, [result])

  return (
    <group ref={vehicle} name='vehicle'>
      <group ref={chassisBody} name='chassisBody'>
        <primitive object={new THREE.BoxGeometry(1, 1, 1)} position={[0, -0.09, 0]} />
      </group>
      {/* <mesh ref={chassisBody}>
        <meshBasicMaterial transparent={true} opacity={0.3} />
        <boxGeometry args={chassisBodyArgs} />
      </mesh> 
      // <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
      // <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
      // <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
      // <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
      //*/}
    </group>
  )
}
