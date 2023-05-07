'use client'

import { forwardRef, ReactNode, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

interface ViewPropsType {
  className: string
  children: ReactNode
  orbit: boolean
}

export const Common = ({ color }) => (
  <Suspense fallback={null}>
    <PerspectiveCamera
      /* //@ts-ignore */
      makeDefault
      fov={40}
      position={[0, 0, 6]}
    />
    {color && <color attach='background' args={[color]} />}
    <ambientLight intensity={0.5} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color='blue' />
  </Suspense>
)

const View = forwardRef((props: ViewPropsType, ref) => {
  const { className, children, orbit } = props
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} className={className} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
