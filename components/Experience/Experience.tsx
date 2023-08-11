"use client"
import React, { use, useCallback, useEffect, useRef, useState } from 'react'
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
import { LerpEngine, lerpControls } from './LerpEngine'
import calculateInstanceLevel from './InstanceLevelCalculator'
import { isPathEquivalent, isInstanceDescendant, isInstanceSibling } from './PathAnalyzer'

// Camera Positions
const introStartPosition = new THREE.Vector3(-50.0, 0.0, 0.0);
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
    const [targetPath, setTargetPath] = useState<any>(pathGenerator.createPath('main', 'intro'));
    const targetPathRef = useRef<any>(targetPath);
    const { placehover, setPlaceHover, currentInstance, setCurrentInstance, setLoadingState, setLoadingProgress } = useExperienceContext();
    const [prevInstance, setPrevInstance] = useState<string>('main');
    const [instanceControls, setInstanceControls] = useState<any>(InstanceControls(currentInstance, data));
    const [prevControls, setPrevControls] = useState<any>(InstanceControls(prevInstance, data));
    const instanceControlsRef = useRef<any>(instanceControls);
    const prevControlsRef = useRef<any>(prevControls);
    const instanceRef = useRef<string>(currentInstance);
    const prevInstanceRef = useRef<string>(prevInstance);
    const [isIntroCompleted, setIsIntroCompleted] = useState<boolean>(false);
    const isIntroCompletedRef = useRef<boolean>(isIntroCompleted);
    const [instanceLevel, setInstanceLevel] = useState<number>(1);
    const instanceLevelRef = useRef<number>(instanceLevel);
    const [isPathChanged, setIsPathChanged] = useState<boolean>(false);
    const isPathChangedRef = useRef<boolean>(isPathChanged);
    const [prevTargetPath, setPrevTargetPath] = useState<any>(targetPath);
    const prevTargetPathRef = useRef<any>(prevTargetPath);
    const [isNavDescending, setIsNavDescending] = useState<boolean>(false);
    const isNavDescendingRef = useRef<boolean>(isNavDescending);
    const [isPortrait, setIsPortrait] = useState<boolean>(false);
    const isPortraitRef = useRef<any>(isPortrait);

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
            if (aspect < 1) {
                setIsPortrait(true)
            } else {
                setIsPortrait(false)
            }
        }
    }, [renderer3d]);

    // HANDLE BUTTON CLICK
    useEffect(() => {

        const instance = data.find((item: any) => item.key === instanceRef.current);
        const instanceParent = instance?.parentKey;
        const current = instance?.key;
        if (instanceParent !== 'root') {
            setPrevInstance(current);  // updating previous instance ref
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

    useEffect(() => {
        prevTargetPathRef.current = prevTargetPath;
    }, [prevTargetPath]);

    // UPDATE NAVIGATION STATE
    useEffect(() => {
        isNavDescendingRef.current = isNavDescending;
    }, [isNavDescending]);

    // UPDATE LERP STATE
    useEffect(() => {
        instanceLevelRef.current = instanceLevel;
    }, [instanceLevel]);

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

    // UPDATE PATH CHANGED STATE
    useEffect(() => {
        isPathChangedRef.current = isPathChanged;
    }, [isPathChanged]);

    // UPDATE PORTRAIT / LANDSCAPE STATE
    useEffect(() => {
        isPortraitRef.current = isPortrait;
    }, [isPortrait])

    // SPACE TRAVELER
    useEffect(() => {
        instanceRef.current = currentInstance;
        prevInstanceRef.current = prevInstance;
        const level = calculateInstanceLevel(currentInstance, data);
        setInstanceLevel(level);

        if (currentInstance !== 'root') {

            let nextPath = pathGenerator.createPath(prevInstanceRef.current, currentInstance);

            if (isPathEquivalent(prevTargetPathRef.current, nextPath)) {
                setIsPathChanged(false);
            } else if (isInstanceDescendant(currentInstance, prevInstanceRef.current, data)) {
                setIsNavDescending(true);
                setIsPathChanged(true);
                setPrevTargetPath(nextPath);
                setTargetPath(nextPath);
            } else if (isInstanceSibling(currentInstance, prevInstanceRef.current, data)) {
                //console.log('sibling');
            } else {
                let backPath = pathGenerator.createPath(currentInstance, prevInstanceRef.current);
                setIsNavDescending(false);
                setIsPathChanged(true);
                setPrevTargetPath(backPath);
                setTargetPath(backPath);
            }
        }
        setPrevControls(InstanceControls(prevInstanceRef.current, data));
        setInstanceControls(InstanceControls(currentInstance, data));
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
            if (aspect < 1) {
                setIsPortrait(true)
            } else {
                setIsPortrait(false)
            }
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
                    setPlaceHover({ name: '', isSibling: false })
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
                        setPrevInstance(instanceRef.current);  // updating previous instance ref
                        setCurrentInstance(pathName);
                    } else { console.log('you have to select something') }
                }
            });


            // CONTROLS
            const objectTarget = new THREE.Object3D();
            const controls = Controls(camera, objectTarget, renderer3d, data);
            setControls(controls);

            let currentPath : any;
            let nextControls : any;
            let prevControls : any;
            let currentControls : any;

            objectTarget.position.copy(generalTarget);
            let targetPosition = new THREE.Vector3();

            // LERP SETTINGS
            const lerp = new LerpEngine();
            let lerpProgress: number;
            let prevFramePath: any;

            // Counter for unchanged camera position frames
            let prevCameraPosition = new THREE.Vector3();
            let unchangedFrames = 0;

            const animate = () => {
                req = requestAnimationFrame(animate);
                frame = frame <= 100 ? frame + 1 : frame;

                // IS SELECTED?
                if (zonesRef.current && zonesRef.current.length > 0) {
                    objectSelector.update(zonesRef.current, camera, instanceRef.current);
                    const currentSelection = objectSelector.getCurrentSelection();
                    if (placehover.name !== currentSelection && isLongClick === false) {
                        if (currentSelection === 'no selections') {
                            setPlaceHover({ name: '', isSibling: null });
                        } else {
                            const selectedObject = data.find(obj => obj.key === currentSelection);
                            const isSibling = isInstanceSibling(selectedObject.key, instanceRef.current, data);
                            if (selectedObject) {
                                setPlaceHover({name: selectedObject.name, isSibling: isSibling});
                            }
                        }
                    }
                }

                // Compare current position with previous position
                if (camera.position.x.toFixed(3) === prevCameraPosition.x.toFixed(3)
                    && camera.position.z.toFixed(3) === prevCameraPosition.z.toFixed(3)) {
                    unchangedFrames++;
                } else {
                    unchangedFrames = 0;
                }

                // LERPING
                lerp.current = gsap.utils.interpolate(
                    lerp.current,
                    lerp.target,
                    lerp.ease
                );

                lerp.target = instanceLevelRef.current - 1;

                // GLITCH DETECTION
                prevCameraPosition.copy(camera.position);

                prevFramePath = currentPath;
                currentPath = targetPathRef.current;
                if (currentPath !== prevFramePath) {
                    lerpProgress = isNavDescendingRef.current? 0 : 1;
                } else { lerpProgress = lerp.current - Math.floor(lerp.current) }

                nextControls = instanceControlsRef.current;
                prevControls = prevControlsRef.current;
                currentControls = lerpControls(prevControls, nextControls, lerpProgress, isNavDescendingRef.current);

                if (isPortraitRef.current) {
                    currentControls.maxDistance *= 2;
                    currentControls.minDistance *= 2;
                }
                controls.maxDistance = currentControls.maxDistance;
                controls.minDistance = currentControls.minDistance;
                controls.maxAzimuthAngle = currentControls.maxAzimuthAngle;
                controls.minAzimuthAngle = currentControls.minAzimuthAngle;
                controls.maxPolarAngle = Math.PI / currentControls.maxPolarAngle;
                controls.minPolarAngle = Math.PI / currentControls.minPolarAngle;
                currentPath.getPointAt(lerpProgress, targetPosition);
                objectTarget.position.copy(targetPosition);

                if (lerpProgress >= 0.999) {
                    //controls.autoRotate = false;
                    lerpProgress = 1;
                    setIsPathChanged(false);
                }
                if (lerpProgress <= 0.001) {
                    //controls.autoRotate = true;
                    lerpProgress = 0;
                    setIsPathChanged(false);
                }

                // UPDATE CONTROLS
                controls.update();

                // If the position hasn't changed significantly for a certain number of frames, invert the rotation
                if (unchangedFrames > 30) {
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