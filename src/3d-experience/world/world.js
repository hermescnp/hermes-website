import * as THREE from 'three';
import Experience from '../../experience';
import { gsap } from 'gsap';

import Room from './room';
import Controls from './controls';
import Environment from './environment';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.layout = this.experience.layout;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        this.resources.on('ready', () => {
            this.controls = new Controls('explore');
            this.environment = new Environment();
            this.room = new Room();
            console.log(this.room);
        });

        this.lerp = {
            currentX: 0,
            currentY: 0,
            targetX: 1,
            targetY: 1,
            ease: 0.1,
        };

        this.onMouseMove();
    }

    onMouseMove() {
        window.addEventListener('mousemove', (e) => {
            this.rotationX = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.rotationY = ((window.innerHeight / 2 - e.clientY) * 2) / window.innerHeight;
            this.lerp.targetX = this.rotationX;
            this.lerp.targetY = this.rotationY;
        })
    }

    rebuildControls(MODE) {
        this.controls = new Controls(MODE);
    }

    resize() {}

    update() {
        if(this.room) {
            this.room.update();
        }
        if(this.environment) {
            this.environment.update();
        }
        if(this.controls) {
            this.controls.update();

            this.lerp.currentX = gsap.utils.interpolate(
                this.lerp.currentX,
                this.lerp.targetX,
                this.lerp.ease
            );

            this.lerp.currentY = gsap.utils.interpolate(
                this.lerp.currentY,
                this.lerp.targetY,
                this.lerp.ease
            );
            if (this.controls.pathMode === 'intro') {
            }
            else if (this.controls.pathMode === 'story') {
                //this.room.actualRoom.rotation.y = this.lerp.currentX;
                // this.environment.lightsGroup.rotation.y = this.lerp.currentX;

                this.camera.perspectiveCamera.position.x = -this.lerp.currentX;
                this.camera.perspectiveCamera.position.z = -this.lerp.currentX;
                this.camera.perspectiveCamera.position.y = this.lerp.currentY/2;
            } 
            else if (this.controls.pathMode === 'explore') {
            } 
            else {}
        }
    }
}
