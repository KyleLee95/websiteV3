import { useRef } from 'react'
import { usePlane, useBox } from '@react-three/cannon'
export const TestPlane = () => {
  const [plane, planeAPI] = usePlane(
    () => ({
      args: [1000, 1000],
      type: 'Static',
      rotation: [-Math.PI / 2, 0, 0],
    }),
    useRef(),
  )
  return <mesh geometry={plane.current} />
}
