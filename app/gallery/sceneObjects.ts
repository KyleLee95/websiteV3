import * as THREE from 'three'
import { Vector3 } from 'three'
interface SceneObjectType {
  name: string
  position: Vector3
  scale: number
  type: string
  children: Array<SceneObjectType>
}
export const sceneObjects: SceneObjectType[] = [
  {
    name: 'dione',
    position: new THREE.Vector3(50, 5, 0),
    scale: 0.015,
    type: 'planet',
    children: [],
  },
  { name: 'tgo', position: new THREE.Vector3(2000, 0, 0), scale: 55, type: 'satellite', children: [] },
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
    children: [],
  },
  { name: 'iss', position: new THREE.Vector3(-20, 0, -10), scale: 0.1, type: 'satellite', children: [] },
  {
    name: 'swordfish',
    position: new THREE.Vector3(-50, 0, 70),
    scale: 1,
    type: 'ship',
    children: [],
  },

  { name: 'redtail', position: new THREE.Vector3(-10, 0, 10), scale: 1, type: 'ship', children: [] },

  {
    name: 'mandalorian',
    position: new THREE.Vector3(30, 0, 70),
    scale: 1,
    type: 'ship',
    children: [],
  },
  { name: 'tiefighter', position: new THREE.Vector3(30, 0, 10), scale: 1, type: 'ship', children: [] },
]
