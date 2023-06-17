"use client";
import * as THREE from 'three';

export default class Zonification {
  scene: THREE.Scene;
  zones: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene, data: any[]) {
    this.scene = scene;
    this.generateZones(data);
  }

  generateZones = (data: any) => {
    // Generate Zones
    for (const zone of data) {
      const zoneMesh = new THREE.Mesh(new THREE.BoxGeometry(zone.width, zone.height, zone.depth), 
              new THREE.MeshBasicMaterial({ color: 0x00aaff, visible: false }));
      zoneMesh.position.set(zone.positionX, zone.positionY, zone.positionZ);
      zoneMesh.name = zone.key;
      this.scene.add(zoneMesh);
      this.zones.push(zoneMesh);
    }
  }

  getZones = (): THREE.Mesh[] => {
    return this.zones;
  }
}
