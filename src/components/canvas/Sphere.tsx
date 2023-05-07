import { ReactNode } from 'react'

export const Sphere = (props) => {
  const { position } = props
  return (
    <mesh position={position} scale={0.001}>
      <sphereGeometry args={[15, 32, 16]} />
      <meshBasicMaterial color='white' />
    </mesh>
  )
}
