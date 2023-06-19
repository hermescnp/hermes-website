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
import InstanceControls from './InstanceControls'

// Camera Positions
const introStartPosition = new THREE.Vector3(-70.0, 0.0, 0.0);
const introEndPosition = new THREE.Vector3(-17.0, 0.0, 0.0);
const generalPosition = new THREE.Vector3(-11.0, 6.0, 11.0);

interface ExperienceProps {
    isClicked: boolean;
}

const Experience: React.FC<ExperienceProps> = ({ isClicked }) => {

    // DATA
    const experienceContext = useExperienceContext();
    const data = experienceContext.spaceData;

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
    const [instanceControls, setInstanceControls] = useState<any>(InstanceControls(currentInstance, data));
    const [prevControls, setPrevControls] = useState<any>(InstanceControls(prevInstance, data));
    const instanceControlsRef = useRef<any>(instanceControls);
    const prevControlsRef = useRef<any>(prevControls);
    const instanceRef = useRef<string>(currentInstance);

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
        prevControlsRef.current = prevControls;
        instanceControlsRef.current = instanceControls;
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
        instanceRef.current = currentInstance;
        if (currentInstance !== 'main') {
            setTargetPath(pathGenerator.createPath(prevInstance, currentInstance));
            setPrevControls(InstanceControls(prevInstance, data));
            setInstanceControls(InstanceControls(currentInstance, data));
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
            const controls = Controls(camera, objectTarget, renderer3d, data);
            setControls(controls);

            objectTarget.position.copy(generalTarget);
            let targetPosition = new THREE.Vector3();

            // ANIMATION SETTINGS
            const lerp = {
                current: 0,
                target: 0,
                ease: 0.05,
            };

            // Counter for unchanged camera position frames
            let previousCameraPos = new THREE.Vector3();
            let unchangedFrames = 0;

            const animate = () => {
                req = requestAnimationFrame(animate);
                frame = frame <= 100 ? frame + 1 : frame;

                // IS SELECTED?
                if (zonesRef.current && zonesRef.current.length > 0) {
                    objectSelector.update(zonesRef.current, camera, instanceRef.current);
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
                let currentControls = instanceControlsRef.current;
                let prevControls = prevControlsRef.current;
                let currentMaxDistance = THREE.MathUtils.lerp(prevControls.maxDistance, currentControls.maxDistance, lerp.current);
                let currentMinDistance = THREE.MathUtils.lerp(prevControls.minDistance, currentControls.minDistance, lerp.current);
                let currentMaxAzimuthAngle = THREE.MathUtils.lerp(prevControls.maxAzimuthAngle, currentControls.maxAzimuthAngle, lerp.current);
                let currentMinAzimuthAngle = THREE.MathUtils.lerp(prevControls.minAzimuthAngle, currentControls.minAzimuthAngle, lerp.current);
                let currentMaxPolarAngle = THREE.MathUtils.lerp(prevControls.maxPolarAngle, currentControls.maxPolarAngle, lerp.current);
                let currentMinPolarAngle = THREE.MathUtils.lerp(prevControls.minPolarAngle, currentControls.minPolarAngle, lerp.current);

                controls.autoRotate = true;
                currentPath.getPointAt(lerp.current, targetPosition);
                objectTarget.position.copy(targetPosition);

                controls.maxDistance = currentMaxDistance;
                controls.minDistance = currentMinDistance;
                controls.maxAzimuthAngle = currentMaxAzimuthAngle;
                controls.minAzimuthAngle = currentMinAzimuthAngle;
                controls.maxPolarAngle = Math.PI / currentMaxPolarAngle;
                controls.minPolarAngle = Math.PI / currentMinPolarAngle;
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

                // UPDATE CONTROLS
                controls.update();

                // Compare current position with previous position
                if (camera.position.x === previousCameraPos.x) {
                    unchangedFrames++;
                } else {
                    unchangedFrames = 0;
                }
                previousCameraPos.copy(camera.position);

                // If the position hasn't changed significantly for a certain number of frames, invert the rotation
                if (unchangedFrames > 10) {
                    controls.autoRotateSpeed *= -1;
                    unchangedFrames = 0;
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