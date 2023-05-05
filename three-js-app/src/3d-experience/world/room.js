import * as THREE from 'three';
import Experience from '../../experience';

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.controls = this.experience.world.controls;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;

        this.setModel();
    }

    setModel() {

        this.actualRoom.traverse((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.name === 'Object_777') {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                })
            }
        })

        this.scene.add(this.actualRoom);
    }

    resize() {}

    update() {}
}