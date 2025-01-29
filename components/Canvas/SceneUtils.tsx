import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'

/**
 * Returns a new THREE.Spherical describing the camera's
 * position relative to controls.target.
 */
export function getCurrentSpherical(controls: OrbitControls) {
  // OrbitControls moves the camera (controls.object).
  // We compute the offset from controls.target:
  const offset = new THREE.Vector3()
  offset.copy(controls.object.position).sub(controls.target)

  // Convert that offset to spherical coords (radius, phi, theta).
  const spherical = new THREE.Spherical().setFromVector3(offset)
  return spherical
}

/**
 * Sets the camera's position by applying the given spherical coordinates
 * relative to the current controls.target.
 */
export function setCurrentSpherical(
  controls: OrbitControls,
  spherical: THREE.Spherical
) {
  // Convert the spherical back into a cartesian offset.
  const offset = new THREE.Vector3().setFromSpherical(spherical)

  // Reapply the offset relative to the controls.target.
  controls.object.position.copy(controls.target).add(offset)

  // Make the camera look at the target.
  controls.object.lookAt(controls.target)
}
