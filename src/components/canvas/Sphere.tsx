import { Vector3 } from 'three'

interface SpherePropTypes {
  position: Vector3
  color: string
}
export const Sphere = (props: SpherePropTypes) => {
  const { position, color } = props
  return (
    <mesh position={position} scale={0.1}>
      <sphereGeometry args={[15, 32, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}
