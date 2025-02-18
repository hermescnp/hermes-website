/* import React from 'react'
import * as THREE from 'three'
import { calculateInstanceLevel, calculateSiblingSequence, getInstancePosition, isInstanceDescendant, isInstanceSibling, calculateNearestWayTo, isUniqueChildInstance } from './InstanceAnalyzer'

export default class ObjectSelector {

    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();
    private selection: string = '';
    private rendererDomElement: HTMLCanvasElement;

    constructor(renderer: THREE.WebGLRenderer) {

        this.rendererDomElement = renderer.domElement;

        window.addEventListener('mousemove', (event) => {
            var rect = this.rendererDomElement.getBoundingClientRect();

            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
        })
    }

    update(instances: THREE.Object3D[], camera: any, currentInstance: string, data: any) {
        this.raycaster.setFromCamera(this.mouse, camera);
    
        // Find the parentKey of the currentInstance
        const currentInstanceObject = instances.find(instance => instance.name === currentInstance);
        const currentParentKey = currentInstanceObject ? currentInstanceObject.userData.parentKey : null;
        const verticalSiblings = calculateSiblingSequence(currentInstance, 'vertical', data);
        const horizontalSiblings = calculateSiblingSequence(currentInstance, 'horizontal', data);
    
        // Filter the instances whose "parentKey" value matches the currentInstance or currentParentKey
        const selectableInstances = instances.filter(instance => instance.userData.parentKey === currentInstance
            || instance.userData.parentKey === currentParentKey
            && (verticalSiblings.orderedSiblings.includes(instance.name) || horizontalSiblings.orderedSiblings.includes(instance.name))
            );
    
        const intersects = this.raycaster.intersectObjects(selectableInstances);
    
        // INTERSECT HOVER
        if (intersects.length > 0) {
            for (const intersect of intersects) {
                this.selection = intersect.object.name;
            }
    
            // Change cursor to pointer when hovering over a selectable object
            this.rendererDomElement.style.cursor = 'pointer';
        } else {
            this.selection = "no selections";
    
            // Change cursor back to default when not hovering over a selectable object
            this.rendererDomElement.style.cursor = 'auto';
        }
    }
    

    getCurrentSelection() {
        return (this.selection)
    }
}
 */