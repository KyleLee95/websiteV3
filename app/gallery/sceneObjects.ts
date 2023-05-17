import * as THREE from 'three'
import { Vector3 as YV3 } from 'yuka'
import { Vector3 } from 'three'
interface SceneObjectType {
  name: string
  position: Vector3
  scale: number
  type: string
  children?: Array<SceneObjectType>
  waypoints: Array<YV3>
}
export const sceneObjects: SceneObjectType[] = [
  {
    name: 'dione',
    position: new THREE.Vector3(50, 5, 0),
    scale: 0.015,
    type: 'planet',
    children: [],
    waypoints: [],
  },
  {
    name: 'titan',
    position: new THREE.Vector3(-100, 0, 0),
    scale: 0.015,
    type: 'planet',
    children: [],
    waypoints: [],
  },
  { name: 'sun', position: new THREE.Vector3(10, 0, -35), scale: 0.025, type: 'planet', children: [], waypoints: [] },
  { name: 'juno', position: new THREE.Vector3(0, 0, -55), scale: 0.025, type: 'planet', children: [], waypoints: [] },
  {
    name: 'saturn',
    position: new THREE.Vector3(20, 0, 105),
    scale: 0.025,
    type: 'planet',
    children: [],
    waypoints: [],
  },
  {
    name: 'rhea',
    position: new THREE.Vector3(-100, 0, -300),
    scale: 0.025,
    type: 'planet',
    children: [
      {
        name: 'itokawa',
        position: new THREE.Vector3(200, 0, -30),
        scale: 10,
        type: 'satellite',
        children: [],
        waypoints: [],
      },
    ],
    waypoints: [],
  },
  {
    name: 'uranus',
    position: new THREE.Vector3(-100, 0, 100),
    scale: 0.025,
    type: 'planet',
    children: [],
    waypoints: [],
  },
  {
    name: 'earth',
    position: new THREE.Vector3(-50, 0, -75),
    scale: 0.025,
    type: 'planet',
    children: [
      {
        name: 'tgo',
        position: new THREE.Vector3(1200, 0, 0),
        scale: 45,
        type: 'satellite',
        children: [],
        waypoints: [],
      },
    ],
    waypoints: [],
  },
  { name: 'iss', position: new THREE.Vector3(-20, 0, -40), scale: 0.1, type: 'satellite', children: [], waypoints: [] },
  {
    name: 'swordfish',
    position: new THREE.Vector3(-50, 0, 70),
    scale: 1,
    type: 'ship',
    children: [
      { name: 'redtail', position: new THREE.Vector3(-10, 0, 10), scale: 1, type: 'ship', children: [], waypoints: [] },
    ],
    waypoints: [
      new YV3(-100, 0, -50),
      new YV3(-200, 0, -50),
      new YV3(-200, 0, -100),
      new YV3(-100, 0, -100),
      new YV3(0, 0, 0),
    ],
  },

  {
    name: 'mandalorian',
    position: new THREE.Vector3(0, 0, 0),
    scale: 1,
    type: 'ship',
    children: [
      {
        name: 'tiefighter',
        position: new THREE.Vector3(0, 0, 0),
        scale: 1,
        type: 'ship',
        children: [],
        waypoints: [],
      },
    ],
    waypoints: [
      new YV3(0, 0, 50),
      new YV3(-200, 0, 50),
      new YV3(200, 0, -100),
      new YV3(100, 0, -100),
      new YV3(0, 0, 0),
    ],
  },
]
