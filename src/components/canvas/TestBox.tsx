import { useBox } from '@react-three/cannon'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
export const TestBox = () => {
  const [box, boxAPI] = useBox(() => ({
    args: [1, 1, 1],
  }))

  const [subscribeKeys, getKeys] = useKeyboardControls()
  useFrame((state, delta) => {})
  return (
    <mesh ref={box}>
      <boxGeometry />
      <meshBasicMaterial color='orange' />
    </mesh>
  )
}
