import { useRef } from 'react'
import { usePlane, useBox } from '@react-three/cannon'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
export const TestPlane = () => {
  const [plane, planeAPI] = usePlane(
    () => ({
      args: [100, 100],
      type: 'Static',
      rotation: [-Math.PI / 2, 0, 0],
    }),
    useRef(),
  )
  return <mesh geometry={plane.current} />
}
