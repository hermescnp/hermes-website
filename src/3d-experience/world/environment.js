import * as THREE from 'three';
import Experience from '../../experience';
import { gsap } from 'gsap';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.controls = this.experience.world.controls;

        this.lerp = {
            current: 0,
            target: 1,
            ease: 0.1,
        };

        this.sceneLights();
    }

    sceneLights() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 0.1);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(1024,1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 14, 6);
        //this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
        //this.scene.add(this.ambientLight);

        //SCENE LIGHTS

        this.sceneLight1 = new THREE.PointLight('#ffe175', 2.0, 8.00, 2.00);
        this.sceneLight1.position.set(0.00, 2.20, 5.29);
        //this.scene.add(this.sceneLight1);

        this.sceneLight2 = new THREE.PointLight('#75ddff', 2.0, 8.00, 2.00);
        this.sceneLight2.position.set(-5.01, 1.79, 0.34);
        //this.scene.add(this.sceneLight2);

        this.sceneLight3 = new THREE.PointLight('#ffffff', 2.0, 3.00, 2.00);
        this.sceneLight3.position.set(-0.03, 1.69, 1.44);
        //this.scene.add(this.sceneLight3);

        //LIGHTS OF SECOND FLOOR MODULE

        this.pointLight1 = new THREE.PointLight('#ffffff', 1.60, 2.00, 2.00);
        this.pointLight1.position.set(1.63, 4.26, -0.59);

        this.pointLight2 = new THREE.PointLight('#ffbb00', 1.60, 2.00, 2.00);
        this.pointLight2.position.set(0.67, 3.91, -2.62);

        this.pointLight3 = new THREE.PointLight('#ffbb00', 1.60, 2.00, 2.00);
        this.pointLight3.position.set(0.51, 4.18, -1.29);

        //LIGHTS OF STUDIO MODULE

        this.studioLight1 = new THREE.PointLight('#ffbb00', 1.46, 1.5, 2.00);
        this.studioLight1.position.set(2.10, 1.21, 0.96);

        this.studioLight2 = new THREE.PointLight('#00a3d7', 2, 2.00, 2.00);
        this.studioLight2.position.set(2.44, 0.65, 1.54);

        this.studioLight3 = new THREE.PointLight('#00a3d7', 1.5, 1.00, 1.00);
        this.studioLight3.position.set(-0.03, 0.30, 0.48);

        //LIGHTS OF LOBBY MODULE

        this.modelLight = new THREE.PointLight('#ffbb00', 2.00, 1.00, 2.00);
        this.modelLight.position.set(-1.89, 0.576, 1.17);

        //LIGHTS OF LIBRARY MODULE

        this.libraryLight1 = new THREE.PointLight('#fee48a', 1.00, 3.00, 2.00);
        this.libraryLight1.position.set(-0.88, 1.17, -1.14);

        this.libraryLight2 = new THREE.PointLight('#ffffff', 1.84, 2.00, 2.00);
        this.libraryLight2.position.set(-2.47, 2.16, -2.05);

        this.lightsGroup = new THREE.Group();
        this.lightsGroup.add(this.pointLight1, this.pointLight2, this.pointLight3, this.studioLight1, this.studioLight2, this.studioLight3, this.modelLight, this.libraryLight1, this.libraryLight2);
        //this.scene.add(this.lightsGroup);
    }

    resize() {}

    update() {}

}