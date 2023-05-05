import * as THREE from 'three';
import Experience from '../../experience';

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setFloor();
    }

    setFloor() {
        this.geometry = new THREE.PlaneGeometry(100, 100);
        this.material = new THREE.MeshStandardMaterial({
            color: 0x364c6c,
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.BackSide,
        })
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);
        this.plane.rotation.x = Math.PI / 2;
        this.plane.position.y = -0.1;
    }

    resize() {}

    update() {}

}