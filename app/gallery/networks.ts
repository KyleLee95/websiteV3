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
export const networks: SceneObjectType[] = [
  { name: 'linkedin', position: new THREE.Vector3(-3, 0, -60), scale: 1, type: 'icon', children: [], waypoints: [] },
  { name: 'github', position: new THREE.Vector3(0, 0, -60), scale: 0.25, type: 'icon', children: [], waypoints: [] },
  { name: 'email', position: new THREE.Vector3(5, 0, -60), scale: 1, type: 'icon', children: [], waypoints: [] },
]
