'use client'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Vector3 } from 'three'
interface PlanetType {
  name: string
  position: Vector3
  scale: number
}
const planets: PlanetType[] = [
  { name: 'dione', position: new THREE.Vector3(50, 5, 0), scale: 0.015 },
  { name: 'itokawa', position: new THREE.Vector3(-30, 0, -30), scale: 0.0025 },
  { name: 'titan', position: new THREE.Vector3(-100, 0, 0), scale: 0.015 },
  { name: 'sun', position: new THREE.Vector3(0, 0, 0), scale: 0.025 },
]
const Galaxy = dynamic(() => import('@/components/canvas/Galaxy').then((mod) => mod.Galaxy), { ssr: false })
const Sphere = dynamic(() => import('@/components/canvas/Sphere').then((mod) => mod.Sphere), { ssr: false })
const Rocket = dynamic(() => import('@/components/canvas/Rocket').then((mod) => mod.Rocket), { ssr: false })
const Planet = dynamic(() => import('@/components/canvas/Planet').then((mod) => mod.Planet), { ssr: false })
const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
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

export default function Page() {
  return (
    <>
      <div className='h-full w-full'>
        <View orbit={false} className='h-full w-full'>
          <Suspense fallback={null}>
            {planets.map((planet) => {
              return <Planet key={planet.name} position={planet.position} planet={planet.name} scale={planet.scale} />
            })}
            <Galaxy />
            <Rocket />
            <Common color='black' />
          </Suspense>
        </View>
      </div>
    </>
  )
}
