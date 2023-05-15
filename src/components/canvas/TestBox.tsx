import { useBox, useRaycastVehicle } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import * as CANNON from 'cannon-es'
export const TestBox = () => {
  const [ref, api] = useBox(() => ({ args: [1, 1, 1], mass: 0, type: 'Dynamic', position: [0, 0, 0] }))
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const velocity = useRef([0, 0, 0])
  const angVel = useRef([0, 0, 0])
  const rotation = useRef([0, 0, 0])
  let turningRotation = 0
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v))
    return unsubscribe
  }, [])
  useEffect(() => {
    const unsubscribe = api.rotation.subscribe((r) => (rotation.current = r))
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = api.angularVelocity.subscribe((a) => (angVel.current = a))
    return unsubscribe
  }, [])
  useFrame(({ clock }, delta) => {
    const { left, right, forward } = getKeys()
    if (left) {
      console.log('here')
    }
  })
  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 1, 1]} />
      <meshBasicMaterial color='orange' />
    </mesh>
  )
}
