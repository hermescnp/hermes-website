import React from 'react'
import * as THREE from 'three';

export default function getZones(scene: any) {

  let zones = [];

  // SELECTABLE AREAS
  const lobbyTable = new THREE.BoxGeometry(1.2, 1, 1);
  const cube2 = new THREE.BoxGeometry(2, 2, 2);
  const trophyTable = new THREE.BoxGeometry(0.5, 1, 1.5);
  const libraryCube = new THREE.BoxGeometry(2, 2, 1);
  const wallCube = new THREE.BoxGeometry(0.9, 1.2, 0.3);
  const invisibleTexture = new THREE.MeshBasicMaterial({ color: 0x00aaff, visible: false });

  const studioArea = new THREE.Mesh(cube2, invisibleTexture);
  studioArea.position.set(2, 2.0, 1.5);
  studioArea.name = 'studio';
  scene.add(studioArea);
  zones.push(studioArea);

  const awardsArea = new THREE.Mesh(trophyTable, invisibleTexture);
  awardsArea.position.set(0.25, 0.5, 2.25);
  awardsArea.name = 'awards';
  scene.add(awardsArea);
  zones.push(awardsArea);

  const lobbyArea = new THREE.Mesh(lobbyTable, invisibleTexture);;
  lobbyArea.position.set(-1.9, 0.5, 1.20);
  lobbyArea.name = 'lobby';
  scene.add(lobbyArea);
  zones.push(lobbyArea);

  const libraryArea = new THREE.Mesh(libraryCube, invisibleTexture);
  libraryArea.position.set(-1, 1, -1.5);
  libraryArea.name = 'library';
  scene.add(libraryArea);
  zones.push(libraryArea);

  const stairsArea = new THREE.Mesh(wallCube, invisibleTexture);
  stairsArea.position.set(-2.5, 2.3, -2.7);
  stairsArea.name = 'stairs';
  scene.add(stairsArea);
  zones.push(stairsArea);

  const rooftopArea = new THREE.Mesh(cube2, invisibleTexture);
  rooftopArea.position.set(2, 3.5, -1);
  rooftopArea.name = 'rooftop';
  scene.add(rooftopArea);
  zones.push(rooftopArea);

  return (
    zones
  )
}
