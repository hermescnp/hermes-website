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
            //child.castShadow = true;
            //child.receiveShadow = true;

            if (child.name === 'Object_777') {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screenA,
                })
            }
            if (child.name === 'Object_17') {
                const textureLoader = new THREE.TextureLoader();
                const textureAlpha = textureLoader.load('/textures/Follaje_Diffuse-Alpha.png');
                textureAlpha.transparent = true;
                textureAlpha.alphaTest = 0.5;
                child.material = new THREE.MeshStandardMaterial({
                    map: textureAlpha,
                    specular: 0x000000,
                    shininess: 0,
                    reflectivity: 0,
                    roughness: 1,
                })
                child.material.transparent = true;
                child.material.alphaTest = 0.5;
            }
        })

        this.scene.add(this.actualRoom);
    }

    resize() {}

    update() {}
}