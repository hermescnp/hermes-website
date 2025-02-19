import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const Background_R3F = () => {
    const { scene } = useThree();

    useEffect(() => {
        const color = new THREE.Color();
        color.set(0x1e2332);
        scene.fog = new THREE.Fog(color, 50, 70);

        const hdrEquirect = new RGBELoader();
        hdrEquirect.load(
            '/textures/night-environment.hdr', (hdri) => {
                hdri.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = hdri;
                scene.backgroundBlurriness = 0.3;
                scene.environment = hdri;
                scene.background = color;
            }
        );
    }, [scene]);

    return null;
};

export default Background_R3F;
