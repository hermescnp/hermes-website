import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from '../experience';

export default class Camera{
    constructor() {
        this.experience = new Experience();
        this.layout = this.experience.layout;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.createPerspectiveCamera();
    }

    

    createPerspectiveCamera(){

        this.perspectiveCamera = new THREE.PerspectiveCamera(
            25,
            this.layout.aspect,
            0.01,
            1000
            );
            this.scene.add(this.perspectiveCamera);

            // Camera Targets
            this.generalTarget = new THREE.Vector3(0.0, 2.0, 0.0);

            // Camera Set Target
            this.perspectiveCamera.lookAt(this.generalTarget);
    }

    resize() {
        // Updating Perspective Camera on Resize
        this.perspectiveCamera.aspect = this.layout.aspect;
        this.perspectiveCamera.updateProjectionMatrix();
    }

    update() {
    }

}
