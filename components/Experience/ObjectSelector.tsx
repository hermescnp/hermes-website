import React from 'react'
import * as THREE from 'three';

export default class ObjectSelector {

    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();
    private selection : string = '';
    private rendererDomElement : HTMLCanvasElement;

    constructor(renderer: THREE.WebGLRenderer) {

        this.rendererDomElement = renderer.domElement;

        window.addEventListener('mousemove', (event) => {
            var rect = this.rendererDomElement.getBoundingClientRect();

            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
        })
    }

    update(instances : any, camera : any) {
        this.raycaster.setFromCamera(this.mouse, camera);
        const intersects = this.raycaster.intersectObjects(instances);
        
        // INTERSECT HOVER
        if (intersects.length > 0) {
            for (const intersect of intersects) {
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
