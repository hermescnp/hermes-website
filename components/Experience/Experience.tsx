"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RenderView } from './styles'
import '../../styles/Experience.css'

import * as THREE from 'three'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from 'gsap';

import Renderer3d from './Renderer3d'
import Renderer2d from './Renderer2d'
import Camera from './Camera'
import Controls from './Controls'
import getModel from './Model';
import PathGenerator from './PathGenerator'
import Zonification from './Zonification'
import ObjectSelector from './ObjectSelector';
import { useExperienceContext } from '@/context/ExperienceContext';

// Camera Positions
const introStartPosition = new THREE.Vector3(-70.0, 0.0, 0.0);
const introEndPosition = new THREE.Vector3(-17.0, 0.0, 0.0);
const generalPosition = new THREE.Vector3(-11.0, 6.0, 11.0);

interface ExperienceProps {
    data: any[];
    isClicked: boolean;
}

const Experience: React.FC<ExperienceProps> = ({ data, isClicked }) => {

    // INSTANCE TRAVELER
    const pathGenerator = new PathGenerator(data);

    // MAIN CAMERA TARGET
    const generalTarget = new THREE.Vector3(data[0].positionX, data[0].positionY, data[0].positionZ);

    const refBody = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [renderer3d, setRenderer3d] = useState<any>();
    const [renderer2d, setRenderer2d] = useState<any>();
    const [_camera, setCamera] = useState<any>();
    const [target, setTarget] = useState(generalTarget);
    const [initialCameraPosition] = useState(
        generalPosition
    );
    const [scene] = useState(new THREE.Scene());
    const [_controls, setControls] = useState<any>();
    const [model, setModel] = useState<any>(false);
    const [lerpState, setLerpState] = useState<number>(0);
    const [targetPath, setTargetPath] = useState<any>(pathGenerator.createPath('main', 'studio'));
    const lerpStateRef = useRef<number>(lerpState);
    const targetPathRef = useRef<any>(targetPath);
    const { placehover, setPlaceHover, currentInstance, setCurrentInstance } = useExperienceContext();
    const [prevInstance, setPrevInstance] = useState<string>('main');

    const [zones, setZones] = useState<any>([]);  // Declare zones state
    const zonesRef = useRef(zones);  // Declare zones ref

    // HANDLE WINDOW RESIZE
    const handleWindowResize = useCallback(() => {
        const { current: container } = refBody;
        if (container && renderer3d) {
            const scW = container.clientWidth;
            const scH = container.clientHeight;
            const aspect = scW / scH;

            renderer3d.setSize(scW, scH);
            renderer3d.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer2d.setSize(scW, scH);
            _camera.aspect = aspect;
            _camera.updateProjectionMatrix();
        }
    }, [renderer3d]);

    // HANDLE BUTTON CLICK
    useEffect(() => {
        setLerpState(0);
        const instance = data.find((item: any) => item.key === currentInstance);
        const instanceParent = instance?.parentKey;
        if (instanceParent !== 'root') {
            setCurrentInstance(instanceParent);
        }
    }, [isClicked]);

    // UPDATE TARGET PATH
    useEffect(() => {
        targetPathRef.current = targetPath;
    }, [targetPath]);

    // UPDATE LERP STATE
    useEffect(() => {
        lerpStateRef.current = lerpState;
    }, [lerpState]);

    // UPDATE ZONES
    useEffect(() => {
        zonesRef.current = zones;
    }, [zones]);

    // SPACE TRAVELER
    useEffect(() => {
        if (currentInstance !== 'main') {
            setTargetPath(pathGenerator.createPath(prevInstance, currentInstance));
            setLerpState(1);
        }
    }, [currentInstance]);

    //  EXPERIENCE ENGINE
    useEffect(() => {
        const { current: container } = refBody;

        if (container && !renderer3d) {
            const scW = container.clientWidth;
            const scH = container.clientHeight;
            const aspect = scW / scH;


            // RENDER SETTINGS
            const renderer2d = Renderer2d(scW, scH, scene);
            const renderer3d = Renderer3d(scW, scH);
            container.appendChild(renderer2d.domElement);
            container.appendChild(renderer3d.domElement);
            setRenderer2d(renderer2d);
            setRenderer3d(renderer3d);

            const camera = Camera(initialCameraPosition, target, aspect);
            setCamera(camera);
            //cameraRef.current = camera;


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

            // RESOURCES
            const model = getModel(scene);
            setModel(model);
            setLoading(false);

            // MAKING SELECTABLE
            const zonification = new Zonification(scene, data);
            const zones = zonification.getZones();
            setZones(zones);
            const objectSelector = new ObjectSelector(renderer3d);

            let req: any = null;
            let frame = 0;

            let isMousePressed = false;
            let isLongClick = false;
            let longClickThreshold = 300;
            let mouseDownTimeout: any;

            window.addEventListener('mousedown', () => {
                isMousePressed = true;
                isLongClick = false;
                mouseDownTimeout = setTimeout(function () {
                    isLongClick = true;
                    setPlaceHover('')
                }, longClickThreshold);
            });

            window.addEventListener('mouseup', () => {
                isMousePressed = false;
                clearTimeout(mouseDownTimeout);
                setTimeout(function () {
                    isLongClick = false;
                }, 100);
            });

            window.addEventListener('click', () => {

                if (!isMousePressed && !isLongClick) {
                    const pathName = objectSelector.getCurrentSelection();
                    if (pathName !== 'no selections') {
                        //setLerpState(0);
                        setPrevInstance(currentInstance);
                        setCurrentInstance(pathName);
                    } else { console.log('you have to select something') }
                }
            });

            // CONTROLS
            const objectTarget = new THREE.Object3D();
            const controls = Controls(camera, objectTarget, renderer3d);
            setControls(controls);

            // ANIMATION SETTINGS
            const lerp = {
                current: 0,
                target: 0,
                ease: 0.05,
            };

            objectTarget.position.copy(generalTarget);
            let targetPosition = new THREE.Vector3();

            const animate = () => {
                req = requestAnimationFrame(animate);
                frame = frame <= 100 ? frame + 1 : frame;

                // IS SELECTED?
                if (zonesRef.current && zonesRef.current.length > 0) {
                    objectSelector.update(zonesRef.current, camera);
                    const currentSelection = objectSelector.getCurrentSelection();
                    if (placehover !== currentSelection && isLongClick === false) {
                        if (currentSelection === 'no selections') {
                            setPlaceHover('');
                        } else {
                            const selectedObject = data.find(obj => obj.key === currentSelection);
                            if (selectedObject) {
                                setPlaceHover(selectedObject.name);
                            }
                        }
                    }
                }

                // LERPING
                lerp.current = gsap.utils.interpolate(
                    lerp.current,
                    lerp.target,
                    lerp.ease
                );
                lerp.target = gsap.utils.clamp(0, 1, lerp.target);
                lerp.current = gsap.utils.clamp(0, 1, lerp.current);

                lerp.target = lerpStateRef.current;
                let currentPath = targetPathRef.current;

                controls.autoRotate = true;
                currentPath.getPointAt(lerp.current, targetPosition);
                objectTarget.position.copy(targetPosition);

                controls.maxDistance = 23 - (lerp.current * 18);
                controls.minDistance = 17 - (lerp.current * 12);
                controls.minAzimuthAngle = -1.7 + (lerp.current / 5);
                controls.maxAzimuthAngle = 0.1 - (lerp.current / 2);
                controls.minPolarAngle = Math.PI / (4 - (lerp.current));
                controls.maxPolarAngle = Math.PI / (2 + (lerp.current / 10));
                // camera.fov = 25 + (lerp.current * 15);
                // camera.updateProjectionMatrix();

                if (lerp.current >= 0.999) {
                    controls.autoRotate = false;
                    lerp.current = 1;
                }
                if (lerp.current <= 0.001) {
                    controls.autoRotate = true;
                    lerp.current = 0;
                }

                controls.update();

                // REVERSE AUTO ROTATION
                if (camera.position.x >= 1.1) {
                    controls.autoRotateSpeed = 0.2;
                } else if (camera.position.z <= -1.4) {
                    controls.autoRotateSpeed = -0.2;
                }

                // RENDER ALL
                renderer3d.render(scene, camera);
                renderer2d.render(scene, camera);
            }

            // START ANIMATION
            req = requestAnimationFrame(animate);

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
        <RenderView ref={refBody} />
    )
}

export default Experience