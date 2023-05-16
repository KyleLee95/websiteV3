import { useState, useRef, useEffect } from 'react'
import { useRaycastVehicle, useBox, Triplet } from '@react-three/cannon'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import { useWheels } from './useWheels'
import { useControls } from './useControls'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
export const TestBox = (thirdPerson) => {
  const gltf = useLoader(GLTFLoader, '/rocket.glb')
  const [box, boxAPI] = useBox(
    () => ({
      args: [2, 2, 2],
      position: [0, 5, 0],
      mass: 1,
    }),
    useRef(),
  )

  const position: Triplet = [-1.5, 1.5, 3]
  const width = 0.15
  const height = 0.07
  const front = 0.15
  const wheelRadius = 0.05

  const chassisBodyArgs: Triplet = [width, height, front * 2]
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

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
  useControls(vehicleApi, chassisApi)
  const [subscribeKeys, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    if (!thirdPerson) return
    console.log(chassisBody)

    const cameraTarget = new THREE.Vector3()
    cameraTarget.setFromMatrixPosition(chassisBody.current.matrixWorld)
    cameraTarget.y += 0.25

    const position = new THREE.Vector3().setFromMatrixPosition(chassisBody.current.matrixWorld)
    let quaternion = new THREE.Quaternion(0, 0, 0, 0)
    quaternion.setFromRotationMatrix(chassisBody.current.matrixWorld)
    let wDir = new THREE.Vector3(0, 0, 1)
    wDir.applyQuaternion(quaternion)
    wDir.normalize()

    wDir.add(new THREE.Vector3(0, 0.2, 0))
    let cameraPosition = position.clone().add(wDir.clone().multiplyScalar(1).add(new THREE.Vector3(0, 0.3, 0)))

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)
    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)
  })

  // const cameraPosition = new THREE.Vector3();
  // cameraPosition.copy(bodyPosition);
  // cameraPosition.z += 2.25;
  // cameraPosition.y += 0.65;
  //
  // const cameraTarget = new THREE.Vector3();
  // cameraTarget.copy(bodyPosition);
  // cameraTarget.y += 0.25;
  //
  // smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
  // smoothedCameraTarget.lerp(cameraTarget, 5 * delta);
  //
  // state.camera.position.copy(smoothedCameraPosition);
  // state.camera.lookAt(smoothedCameraTarget);
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
        <primitive object={gltf.scene} position={[0, 0, 0]} scale={0.1} />
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
