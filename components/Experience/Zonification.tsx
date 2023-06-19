"use client";
import * as THREE from 'three';

export default class Zonification {
  scene: THREE.Scene;
  zones: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene, data: any[]) {
    this.scene = scene;
    this.generateZones(data);
    console.log(this.zones);
  }

generateZones = (data: any) => {
  // Generate Zones
  for (const zone of data) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.5,
      visible: false
    });
    const zoneMesh = new THREE.Mesh(
      new THREE.BoxGeometry(zone.width, zone.height, zone.depth),
      material
    );
    zoneMesh.position.set(zone.positionX, zone.positionY, zone.positionZ);
    zoneMesh.name = zone.key;
    zoneMesh.userData.parentKey = zone.parentKey;
    this.scene.add(zoneMesh);
    this.zones.push(zoneMesh);
  }
}

  getZones = (): THREE.Mesh[] => {
    return this.zones;
  }
}
