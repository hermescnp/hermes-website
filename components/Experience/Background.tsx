import React from 'react'
import * as THREE from 'three'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export default function setBackground(scene: any) {

    // BACKGROUND SETTINGS
    const color = new THREE.Color();
    color.set(0x1e2332);
    scene.fog = new THREE.Fog(color, 20, 50);

    const ambientLight = new THREE.AmbientLight('#ffe175', 0.2);
    scene.add(ambientLight);

    const hdrEquirect = new RGBELoader();
    hdrEquirect.load(
        "/textures/night-environment.hdr", (hdri: any) => {
            hdri.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = hdri;
            scene.backgroundBlurriness = 0.3;
            scene.environment = hdri;
            scene.background = color;
        }
    );
}
