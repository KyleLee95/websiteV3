'use client'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { Vector3 } from 'three'
import { KeyboardControls, Html, useProgress, OrbitControls } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Physics, usePlane, useBox, Debug } from '@react-three/cannon'
interface SceneObjectType {
  name: string
  position: Vector3
  scale: number
  type: string
  children: Array<SceneObjectType>
}
const sceneObjects: SceneObjectType[] = [
  {
    name: 'dione',
    position: new THREE.Vector3(50, 5, 0),
    scale: 0.015,
    type: 'planet',
    children: [{ name: 'tgo', position: new THREE.Vector3(2000, 0, 0), scale: 55, type: 'satellite', children: [] }],
  },
  { name: 'itokawa', position: new THREE.Vector3(-30, 0, -30), scale: 0.0025, type: 'satellite', children: [] },
  {
    name: 'titan',
    position: new THREE.Vector3(-100, 0, 0),
    scale: 0.015,
    type: 'planet',
    children: [],
  },
  { name: 'sun', position: new THREE.Vector3(10, 0, -35), scale: 0.025, type: 'planet', children: [] },
  { name: 'juno', position: new THREE.Vector3(0, 0, -55), scale: 0.025, type: 'planet', children: [] },
  { name: 'saturn', position: new THREE.Vector3(20, 0, 105), scale: 0.025, type: 'planet', children: [] },
  { name: 'rhea', position: new THREE.Vector3(-100, 0, -300), scale: 0.025, type: 'planet', children: [] },
  { name: 'uranus', position: new THREE.Vector3(-100, 0, 100), scale: 0.025, type: 'planet', children: [] },
  {
    name: 'earth',
    position: new THREE.Vector3(-50, 0, -75),
    scale: 0.025,
    type: 'planet',
    children: [{ name: 'iss', position: new THREE.Vector3(-2000, 0, -75), scale: 3, type: 'satellite', children: [] }],
  },

  {
    name: 'swordfish',
    position: new THREE.Vector3(-50, 0, 70),
    scale: 1,
    type: 'ship',
    children: [{ name: 'redtail', position: new THREE.Vector3(-10, 0, 10), scale: 1, type: 'ship', children: [] }],
  },

  {
    name: 'mandalorian',
    position: new THREE.Vector3(30, 0, 70),
    scale: 1,
    type: 'ship',
    children: [{ name: 'tiefighter', position: new THREE.Vector3(30, 0, 10), scale: 1, type: 'ship', children: [] }],
  },
]

const YukaVehicle = dynamic(() => import('@/components/canvas/YukaVehicle').then((mod) => mod.YukaVehicle), {
  ssr: false,
})
const Galaxy = dynamic(() => import('@/components/canvas/Galaxy').then((mod) => mod.Galaxy), { ssr: false })

const TestPlane = dynamic(() => import('@/components/canvas/TestPlane').then((mod) => mod.TestPlane), { ssr: false })
const TestBox = dynamic(() => import('@/components/canvas/TestBox').then((mod) => mod.TestBox), { ssr: false })
const Rocket = dynamic(() => import('@/components/canvas/Rocket').then((mod) => mod.Rocket), { ssr: false })
const SceneObject = dynamic(() => import('@/components/canvas/SceneObject').then((mod) => mod.SceneObject), {
  ssr: false,
})
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })
const Loader = () => {
  const { progress } = useProgress()
  return <Html style={{ background: 'white', color: 'black' }}>{progress} % loaded</Html>
}

export default function Page() {
  const rocketBB = useRef()

  return (
    <Suspense fallback={<Loader />}>
      <View orbit={false} className='h-full w-full'>
        <Physics>
          <Debug scale={1.2} color=''>
            <KeyboardControls
              map={[
                { name: 'up', keys: ['ArrowUp', 'KeyW'] },
                { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
                { name: 'right', keys: ['ArrowRight', 'KeyD'] },
              ]}
            >
              <TestBox />
              <TestPlane />
            </KeyboardControls>
            <SceneObject rocketBB={rocketBB} />
          </Debug>
          <OrbitControls />
          <gridHelper />
          <Common color='black' />
        </Physics>
      </View>
    </Suspense>
  )
}

// <Galaxy />
//
//   <Rocket rocketBB={rocketBB} />
