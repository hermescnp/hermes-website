import * as THREE from 'three';
import gsap from 'gsap';
import { run } from 'node:test';

export default class IntroCinematic {
    progress: number;
    initialCameraPosition : THREE.Vector3;
    introCurve : THREE.CatmullRomCurve3;
    cameraTarget: THREE.Vector3;
    scene : any;
    lerp = {
        current: 0,
        target: 0,
        ease: 0.05,
    };

    constructor(scene: any, data: any, generalPosition : THREE.Vector3) {
        this.progress = 0;
        this.scene = scene;

        if (data[0].parentKey === 'root') {
            this.cameraTarget = new THREE.Vector3(data[0].positionX, data[0].positionY, data[0].positionZ);
        } else { this.cameraTarget = new THREE.Vector3(0.0, 2.0, 0.0) }

        this.initialCameraPosition = new THREE.Vector3(-50.0, 0.0, 0.0);

        this.introCurve = new THREE.CatmullRomCurve3([
            this.initialCameraPosition,
            new THREE.Vector3(-25.0, 0.5, 0.0),
            generalPosition
        ], false);

        this.setPath();
        this.lerp.current = this.progress;
    }

    run() {
        let cameraPosition = this.initialCameraPosition;
        this.introCurve.getPointAt(this.lerp.current, cameraPosition);
        this.lerp.target += 0.002;

        return cameraPosition;
    }

    setPath() {
        const points = this.introCurve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        material.visible = false;
    
        const curveObject = new THREE.Line(geometry, material);
        this.scene.add(curveObject);
    }

    getPath() {
        return this.introCurve;
    }
}