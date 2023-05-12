import { useRef, useEffect } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { CuboidCollider, RigidBody, RapierCollider, useRapier, vec3 } from '@react-three/rapier'
import { KinematicCharacterController } from '@dimforge/rapier3d-compat'
//Some helpers to get the camera working correctly
const calculateIdealLookAt = (rotation: THREE.Euler, position: THREE.Vector3) => {
  const idealLookAt = new THREE.Vector3(2, 2, 2)
  idealLookAt.applyEuler(rotation)
  idealLookAt.add(position)
  return idealLookAt
}
const calculateIdealOffset = (rotation: THREE.Euler, position: THREE.Vector3) => {
  const idealOffset = new THREE.Vector3(0, -55, 70)
  idealOffset.applyEuler(rotation)
  idealOffset.add(position)
  return idealOffset
}

export function Rocket() {
  const rocketGroup = useRef(null)
  const rocket = useRef(null)
  const rigidBody = useRef(null)
  const three = useThree()

  const refState = useRef({
    grounded: false,
    jumping: false,
    velocity: vec3(),
  })
  const controller = useRef<KinematicCharacterController>()
  const { clock } = three
  const elapsedTime = clock.elapsedTime
  const currPosition = new THREE.Vector3()
  const currLookAt = new THREE.Vector3()
  const rapier = useRapier()

  const collider = useRef<RapierCollider>(null)
  console.log(rapier.world.raw().createCharacterController(0.1))
  const [subscribeKeys, getKeys] = useKeyboardControls()
  //init controller
  useEffect(() => {
    const c = rapier.world.raw().createCharacterController(0.1)
    c.setApplyImpulsesToDynamicBodies(true)
    c.setCharacterMass(0.2)
    c.enableSnapToGround(0.02)
    controller.current = c
  }, [rapier])

  useFrame((context, delta) => {
    if (controller.current && rigidBody.current && collider.current) {
      try {
        const { velocity } = refState.current

        const position = vec3(rigidBody.current.translation())
        const movement = vec3()

        // if (keysdown.current.ArrowUp) {
        //   movement.z -= 0.07;
        // }
        // if (keysdown.current.ArrowDown) {
        //   movement.z += 0.07;
        // }
        // if (keysdown.current.ArrowLeft) {
        //   movement.x -= 0.07;
        // }
        // if (keysdown.current.ArrowRight) {
        //   movement.x += 0.07;
        // }
        //
        // if (refState.current.grounded && keysdown.current[" "]) {
        //   velocity.y = 0.2;
        // }
        //
        // if (!refState.current.grounded) {
        //   // Apply gravity
        //   velocity.y -= (9.807 * delta) / 20;
        // }

        movement.add(velocity)

        controller.current.computeColliderMovement(collider.current, movement)
        refState.current.grounded = controller.current.computedGrounded()

        let correctedMovement = controller.current.computedMovement()
        position.add(vec3(correctedMovement))

        rigidBody.current.setNextKinematicTranslation(position)
      } catch (err) {}
    }
  })

  // useEffect(() => {
  //   //rotate the rocket so that it's sideways
  //   rocketGroup.current.rotation.set(-1.5, 0, 0)
  // }, [rocketGroup, rocket])
  //
  // useFrame((state, delta) => {
  //   const { forward, left, right } = getKeys()
  //   if (forward) {
  //     rocketGroup.current.translateY(0.5)
  //   }
  //   if (left) {
  //     const angleOfRotation = Math.PI / 100
  //     rocketGroup.current.rotateZ(angleOfRotation)
  //   }
  //   if (right) {
  //     const angleOfRotation = -Math.PI / 100
  //     rocketGroup.current.rotateZ(angleOfRotation)
  //   }
  // })
  //
  //chase camera

  const gltf = useLoader(GLTFLoader, '/rocket.glb')

  return (
    <RigidBody type='kinematicPosition' ref={rigidBody} colliders={false}>
      <CuboidCollider args={[2, 2, 2]} ref={collider} />
      <group ref={rocketGroup}>
        <primitive ref={rocket} position={[0, 0, 0]} object={gltf.scene} scale={1}></primitive>
      </group>
    </RigidBody>
  )
}
