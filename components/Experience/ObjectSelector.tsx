import React from 'react'
import * as THREE from 'three';

export default class ObjectSelector {

    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();
    private selection : string = '';

    constructor() {

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX / window.innerWidth * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight * 2 - 1);
        })
    }

    update(objects : any, camera : any) {
        this.raycaster.setFromCamera(this.mouse, camera);
        const intersects = this.raycaster.intersectObjects(objects);
        
        // INTERSECT HOVER
        if (intersects.length > 0) {
            for (const intersect of intersects) {
                //console.log(intersect.object.name);
                this.selection = intersect.object.name;
            }
        } else {
            this.selection = "no selections";
        }
    }

    getCurrentSelection() {
        return (this.selection)
    }
}
