const Ring = () => {
  return (
    <mesh>
      <torusGeometry />
      <meshBasicMaterial color='orange' />
    </mesh>
  )
}

export const RingChallenge = () => {
  return <Ring />
}
