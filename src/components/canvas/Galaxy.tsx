import { pbkdf2 } from 'crypto'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
export const Galaxy = () => {
  const parameters = {
    count: 260900,
    size: 5,
    radius: 20300,
    branches: 7,
    spin: -0.532,
    randomness: 0.304,
    randomnessPower: 4.252,
    insideColor: '#be95d0',
    outsideColor: '#7196f4',
  }
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    // Position
    const i3 = i * 3

    const radius = Math.random() * parameters.radius

    const spinAngle = radius * parameters.spin
    const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    // Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const points = new THREE.Points(geometry, material)
  return (
    <points>
      <bufferGeometry attach='geometry'>
        <bufferAttribute
          attach='attributes-position' //attribute parameter yang akan dikontrol
          array={positions}
          count={positions.length / 3} //
          itemSize={3} //dikeranakan telah diketahui bahwa tiap arraytype axis akan berisi 3 value pada 1d array
        />
        <bufferAttribute
          attach='attributes-color' //attribute parameter yang akan dikontrol
          array={colors}
          count={colors.length / 3} //
          itemSize={3} //dikeranakan telah diketahui bahwa tiap arraytype axis akan berisi 3 value pada 1d array
        />
      </bufferGeometry>
      <pointsMaterial
        size={parameters.size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
      />
    </points>
  ) /* return <primitive object={points} /> */
}
