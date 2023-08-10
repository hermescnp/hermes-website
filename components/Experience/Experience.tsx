"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RenderView } from './styles'
import '../../styles/Experience.css'

import * as THREE from 'three'
import setBackground from './Background'
import gsap from 'gsap';

import Renderer3d from './Renderer3d'
import Renderer2d from './Renderer2d'
import Camera from './Camera'
import Controls from './Controls'
import getModel from './Model';
import PathGenerator from './PathGenerator'
import IntroCinematic from './IntroCinematic'
import Zonification from './Zonification'
import ObjectSelector from './ObjectSelector';
import { useExperienceContext } from '@/context/ExperienceContext';
import InstanceControls from './InstanceControls'
import LerpEngine from './LerpEngine'
import calculateInstanceLevel from './InstanceLevelCalculator'

// Camera Positions
const introStartPosition = new THREE.Vector3(-50.0, 0.0, 0.0);
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
    const [renderer3d, setRenderer3d] = useState<any>();
    const [renderer2d, setRenderer2d] = useState<any>();
    const [_camera, setCamera] = useState<any>();
    const [target, setTarget] = useState(generalTarget);
    const [currentCameraPosition, setCurrentCameraPosition] = useState<THREE.Vector3>(generalPosition);
    const [scene] = useState(new THREE.Scene());
    const [_controls, setControls] = useState<any>();
    const [model, setModel] = useState<any>(false);
    const [lerpState, setLerpState] = useState<number>(0);
    const [targetPath, setTargetPath] = useState<any>(pathGenerator.createPath('main', 'studio'));
    const lerpStateRef = useRef<number>(lerpState);
    const targetPathRef = useRef<any>(targetPath);
    const { placehover, setPlaceHover, currentInstance, setCurrentInstance, setLoadingState, setLoadingProgress } = useExperienceContext();
    const [prevInstance, setPrevInstance] = useState<string>('main');
    const [instanceControls, setInstanceControls] = useState<any>(InstanceControls(currentInstance, data));
    const [prevControls, setPrevControls] = useState<any>(InstanceControls(prevInstance, data));
    const instanceControlsRef = useRef<any>(instanceControls);
    const prevControlsRef = useRef<any>(prevControls);
    const instanceRef = useRef<string>(currentInstance);
    const [isIntroCompleted, setIsIntroCompleted] = useState<boolean>(false);
    const isIntroCompletedRef = useRef<boolean>(isIntroCompleted);
    const [instanceLevel, setInstanceLevel] = useState<number>(1);
    const instanceLevelRef = useRef<number>(instanceLevel);

    const [zones, setZones] = useState<any>([]);  // Declare zones state
    const zonesRef = useRef(zones);  // Declare zones ref
    const cameraPositionRef = useRef(currentCameraPosition); // Ref to camera Position

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

    useEffect(() => {
        if (experienceContext.startExperience === true) {
            // setTimeout(() => {
            //     setLerpState(1);
            // }, 3000)
            // setTimeout(() => {
            //     setIsIntroCompleted(true);
            // }, 10000)
        }
    }, [experienceContext.startExperience]);

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

    // UPDATE INTRO STATE
    useEffect(() => {
        isIntroCompletedRef.current = isIntroCompleted;
    }, [isIntroCompleted]);

    // UPDATE CAMERA POSITION
    useEffect(() => {
        cameraPositionRef.current = currentCameraPosition;
    }, [currentCameraPosition]);

    // SPACE TRAVELER
    useEffect(() => {
        instanceRef.current = currentInstance;
        const instanceLevel = calculateInstanceLevel(currentInstance, data);
        setInstanceLevel(instanceLevel);
        console.log("instanceLevel:", instanceLevel);
        
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

            const camera = Camera(currentCameraPosition, target, aspect);
            setCamera(camera);

            // BACKGROUND SETTINGS
            setBackground(scene);

            const model = getModel(scene, setLoadingState, setLoadingProgress);
            setModel(model);

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

            let currentPath;
            let currentControls;
            let prevControls;
            let currentMaxDistance;
            let currentMinDistance;
            let currentMaxAzimuthAngle;
            let currentMinAzimuthAngle;
            let currentMaxPolarAngle;
            let currentMinPolarAngle;

            objectTarget.position.copy(generalTarget);
            let targetPosition = new THREE.Vector3();

            // LERP SETTINGS
            const lerp = new LerpEngine();

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
                currentControls = instanceControlsRef.current;
                prevControls = prevControlsRef.current;

                currentPath = targetPathRef.current;

                currentMaxDistance = THREE.MathUtils.lerp(prevControls.maxDistance, currentControls.maxDistance, lerp.current);
                currentMinDistance = THREE.MathUtils.lerp(prevControls.minDistance, currentControls.minDistance, lerp.current);
                currentMaxAzimuthAngle = THREE.MathUtils.lerp(prevControls.maxAzimuthAngle, currentControls.maxAzimuthAngle, lerp.current);
                currentMinAzimuthAngle = THREE.MathUtils.lerp(prevControls.minAzimuthAngle, currentControls.minAzimuthAngle, lerp.current);
                currentMaxPolarAngle = THREE.MathUtils.lerp(prevControls.maxPolarAngle, currentControls.maxPolarAngle, lerp.current);
                currentMinPolarAngle = THREE.MathUtils.lerp(prevControls.minPolarAngle, currentControls.minPolarAngle, lerp.current);

                controls.enabled = true;
                controls.autoRotate = true;
                controls.maxDistance = currentMaxDistance;
                controls.minDistance = currentMinDistance;
                controls.maxAzimuthAngle = currentMaxAzimuthAngle;
                controls.minAzimuthAngle = currentMinAzimuthAngle;
                controls.maxPolarAngle = Math.PI / currentMaxPolarAngle;
                controls.minPolarAngle = Math.PI / currentMinPolarAngle;
                currentPath.getPointAt(lerp.current, targetPosition);
                objectTarget.position.copy(targetPosition);


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