"use client"
import React, { useCallback, useEffect, useRef, useState} from 'react'
import {RenderView} from './styles'

import * as THREE from 'three'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import Renderer3d from './Renderer3d'
import Renderer2d from './Renderer2d'
import Camera from './Camera'
import Controls from './Controls'
import getModel from './Model';

const Experience: React.FC = () => {

    const refBody = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [renderer3d, setRenderer3d] = useState<any>();
    const [renderer2d, setRenderer2d] = useState<any>();
    const [_camera, setCamera] = useState<any>();
    const [target, setTarget] = useState(new THREE.Vector3(0.0, 2.0, 0.0));
    const [initialCameraPosition] = useState(
        new THREE.Vector3(-11.0, 6.0, 11.0)
    );
    const [scene] = useState(new THREE.Scene());
    const [_controls, setControls] = useState<any>();
    const [model, setModel] = useState<any>(false);

    const handleWindowResize = useCallback(() => {
        const {current: container} = refBody;
        if (container && renderer3d) {
            const scW = container.clientWidth;
            const scH = container.clientHeight;
            const aspect = scW/scH;
            
            renderer3d.setSize(scW, scH);
            renderer3d.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            _camera.aspect = aspect;
            _camera.updateProjectionMatrix();
        }
    }, [renderer3d]);

    useEffect(() => {
        const {current: container} = refBody;

        if (container && !renderer3d) {
            const scW = container.clientWidth;
            const scH = container.clientHeight;
            const aspect = scW/scH;


            // RENDER VIEW SETTINGS
            const renderer2d = Renderer2d(scW, scH, scene);
            const renderer3d = Renderer3d(scW, scH);
            container.appendChild(renderer2d.domElement);
            container.appendChild(renderer3d.domElement);
            setRenderer2d(renderer2d);
            setRenderer3d(renderer3d);

            const camera = Camera(initialCameraPosition, target, aspect)
            setCamera(camera);


            // BACKGROUND SETTINGS
            const color = new THREE.Color();
            color.set(0x1f2637);
            scene.fog = new THREE.Fog(color, 20, 40);

            // const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
            // scene.add(ambientLight);

            const hdrEquirect = new RGBELoader();
            hdrEquirect.load(
                "/textures/night-environment.hdr", (hdri : any) => {
                    hdri.mapping = THREE.EquirectangularReflectionMapping;
                    scene.background = hdri;
                    scene.backgroundBlurriness = 0.3;
                    scene.environment = hdri;
                    scene.background = color;
                    //scene.rotation.y = Math.PI / 12 
                }
            );

            let req: any = null;
            let frame = 0;

            const animate = () => {
                req = requestAnimationFrame(animate);
                frame = frame <= 100 ? frame + 1 : frame;

                controls.update();
                renderer3d.render(scene, camera);
            }

            // RESOURCES
            const controls = Controls(camera, target, renderer3d);
            setControls(controls);

            const model = getModel(scene);
            setModel(model);
            animate();
            setLoading(false);


            return () => {
                console.log('unmount');
                cancelAnimationFrame(req);
                renderer3d.dispose();
            }
        };
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false);

        return () => {
            window.removeEventListener('resize', handleWindowResize, false);
        }
    }, [renderer3d, handleWindowResize])

  return (
    <RenderView ref={refBody}/>
  )
}

export default Experience