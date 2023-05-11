'use client'
import dynamic from 'next/dynamic'
import { KeyboardControls, Html, useProgress, OrbitControls } from '@react-three/drei'
import { useRef, Suspense } from 'react'
const Galaxy = dynamic(() => import('@/components/canvas/Galaxy').then((mod) => mod.Galaxy), { ssr: false })
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
  return (
    <Suspense fallback={<Loader />}>
      <View orbit={false} className='h-full w-full'>
        <Galaxy />
        <KeyboardControls
          map={[
            { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
            { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
            { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          ]}
        >
          <Rocket />
        </KeyboardControls>
        <SceneObject />
        <OrbitControls />
        <gridHelper />
        <Common color='black' />
      </View>
    </Suspense>
  )
}
