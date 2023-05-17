import { useState, useRef, useEffect } from 'react'
import { useRaycastVehicle, useBox, Triplet } from '@react-three/cannon'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import { useWheels } from './useWheels'
import { useControls } from './useControls'
import * as THREE from 'three'
export const Rocket = (thirdPerson) => {
  const gltf = useLoader(GLTFLoader, '/rocket.glb')

  const position: Triplet = [10, 0, 0]
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

  useFrame((state, delta) => {
    if (!thirdPerson) return
    const cameraTarget = new THREE.Vector3()
    cameraTarget.setFromMatrixPosition(chassisBody.current.matrixWorld)
    cameraTarget.y += 0.25

    const position = new THREE.Vector3().setFromMatrixPosition(chassisBody.current.matrixWorld)
    const quaternion = new THREE.Quaternion(0, 0, 0, 0)
    quaternion.setFromRotationMatrix(chassisBody.current.matrixWorld)
    let wDir = new THREE.Vector3(0, 0, 1)
    wDir.applyQuaternion(quaternion)
    wDir.add(new THREE.Vector3(0, 0.2, 0))
    wDir.normalize()

    let cameraPosition = position.clone().add(wDir.clone().multiplyScalar(2).add(new THREE.Vector3(0, 0.1, 0)))

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)
    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)
  })

  return (
    <group ref={vehicle} name='vehicle'>
      <group ref={chassisBody} name='chassisBody'>
        <primitive object={gltf.scene} position={[0, 0, 0]} scale={0.1} />
      </group>
    </group>
  )
}
