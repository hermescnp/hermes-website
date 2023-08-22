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
import { calculateInstanceLevel, calculateSiblingSecuence, getInstancePosition, getCurrentInstance, isInstanceDescendant, isInstanceSibling, getSiblingOrientation, isUniqueChildInstance } from './InstanceAnalyzer'
import { isPathEquivalent, calculateSiblingPosition } from './PathAnalyzer'

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
    const { placehover, setPlaceHover, history, pushToHistory, stepBackHistory, setLoadingState, setLoadingProgress } = useExperienceContext();
    const [isIntroCompleted, setIsIntroCompleted] = useState<boolean>(false);
    const isIntroCompletedRef = useRef<boolean>(isIntroCompleted);

    // NAVIGATION HOOKS
    const [currentInstance, setCurrentInstance] = useState<string>(getCurrentInstance(history));
    const historyRef = useRef<string[]>(history);
    const instanceRef = useRef<string>(currentInstance);
    const [prevInstance, setPrevInstance] = useState<string>('intro');
    const prevInstanceRef = useRef<string>(prevInstance);
    const isHistoryIncreasing = useRef<boolean>(true);

    const [instanceLevel, setInstanceLevel] = useState<number>(1);
    const instanceLevelRef = useRef<number>(instanceLevel);

    const [isPathChanged, setIsPathChanged] = useState<boolean>(false);
    const isPathChangedRef = useRef<boolean>(isPathChanged);

    const [targetPath, setTargetPath] = useState<any>(pathGenerator.createPath('main', 'intro'));
    const targetPathRef = useRef<any>(targetPath);

    const [prevTargetPath, setPrevTargetPath] = useState<any>(targetPath);
    const prevTargetPathRef = useRef<any>(prevTargetPath);

    const [isNavDescending, setIsNavDescending] = useState<boolean>(false);
    const isNavDescendingRef = useRef<boolean>(isNavDescending);

    const [siblingPosition, setSiblingPosition] = useState<THREE.Vector2>(new THREE.Vector2(0, 0));
    const siblingPositionRef = useRef<THREE.Vector2>(siblingPosition);

    const [verticalSiblingAxis, setVerticalSiblingAxis] = useState<any>(pathGenerator.getSiblingAxis(calculateSiblingSecuence('main', 'vertical', data)));
    const verticalSiblingAxisRef = useRef<any>(verticalSiblingAxis);
    const [horizontalSiblingAxis, setHorizontalSiblingAxis] = useState<any>(pathGenerator.getSiblingAxis(calculateSiblingSecuence('main', 'horizontal', data)));
    const horizontalSiblingAxisRef = useRef<any>(horizontalSiblingAxis);

    const [navigationAxis, setNavigationAxis] = useState<string>('x');
    const navigationAxisRef = useRef<string>(navigationAxis);

    // CONTROLS HOOKS
    const [instanceControls, setInstanceControls] = useState<any>(InstanceControls(currentInstance, data));
    const [prevControls, setPrevControls] = useState<any>(InstanceControls(prevInstance, data));
    const instanceControlsRef = useRef<any>(instanceControls);
    const prevControlsRef = useRef<any>(prevControls);

    // RESPONSIVE HOOKS
    const [isPortrait, setIsPortrait] = useState<boolean>(false);
    const isPortraitRef = useRef<any>(isPortrait);

    // POSITION HOOKS
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
            stepBackHistory();
        }
    }, [renderer3d]);

    // HANDLE BUTTON CLICK
    useEffect(() => {

        const instance = data.find((item: any) => item.key === instanceRef.current);
        const instanceParent = instance?.parentKey;
        const current = instance?.key;
        if (instanceParent !== 'root') {
            setPrevInstance(current);  // updating previous instance ref
            stepBackHistory();
        }
    }, [isClicked]);

    useEffect(() => {
        if (experienceContext.startExperience === true) { }
    }, [experienceContext.startExperience]);

    // UPDATE CURRENT INSTANCE
    useEffect(() => {
        if (historyRef.current.length < history.length) { isHistoryIncreasing.current = true }
        else { isHistoryIncreasing.current = false }
        historyRef.current = history;
        setCurrentInstance(getCurrentInstance(history));
    }, [history]);

    // UPDATE TARGET PATH
    useEffect(() => {
        targetPathRef.current = targetPath;
    }, [targetPath]);

    // UPDATE CONTROLS
    useEffect(() => {
        prevControlsRef.current = prevControls;
        instanceControlsRef.current = instanceControls;
    }, [instanceControls]);

    // UPDATE SIBLING AXISES
    useEffect(() => {
        verticalSiblingAxisRef.current = verticalSiblingAxis;
    }, [verticalSiblingAxis]);
    useEffect(() => {
        horizontalSiblingAxisRef.current = horizontalSiblingAxis;
    }, [horizontalSiblingAxis]);

    useEffect(() => {
        prevTargetPathRef.current = prevTargetPath;
    }, [prevTargetPath]);

    // UPDATE NAVIGATION STATE
    useEffect(() => {
        isNavDescendingRef.current = isNavDescending;
    }, [isNavDescending]);

    useEffect(() => {
        navigationAxisRef.current = navigationAxis;
    }, [navigationAxis]);

    // UPDATE LERP STATE
    useEffect(() => {
        instanceLevelRef.current = instanceLevel;
    }, [instanceLevel]);

    useEffect(() => {
        siblingPositionRef.current = siblingPosition;
    }, [siblingPosition]);

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
        let verticalSiblingPath = null;
        let horizontalSiblingPath = null;

        if (isUniqueChildInstance(currentInstance, data)) {
            setSiblingPosition(new THREE.Vector2(0, 0));
        } else {
            verticalSiblingPath = pathGenerator.getSiblingAxis(calculateSiblingSecuence(currentInstance, 'vertical', data));
            const newVerticalSiblingPosition = calculateSiblingPosition(getInstancePosition(currentInstance, data), verticalSiblingPath);
            horizontalSiblingPath = pathGenerator.getSiblingAxis(calculateSiblingSecuence(currentInstance, 'horizontal', data));
            const newHorizontalSiblingPosition = calculateSiblingPosition(getInstancePosition(currentInstance, data), horizontalSiblingPath);
            setSiblingPosition(new THREE.Vector2(newVerticalSiblingPosition, newHorizontalSiblingPosition));
        }

        // Test if the new instance is not the biggest parent
        if (currentInstance !== 'root') {

            let nextPath = pathGenerator.createPath(prevInstanceRef.current, currentInstance);

            // Test is the path to navigate is same as mounted to prevent unnecessary replacement
            if (isPathEquivalent(prevTargetPathRef.current, nextPath)) {
                setIsPathChanged(false);

                // If is different, test if its decending to travel through the new path
            } else if (isInstanceDescendant(currentInstance, prevInstanceRef.current, data)) {
                setIsNavDescending(true);
                setIsPathChanged(true);
                setPrevTargetPath(nextPath);
                setTargetPath(nextPath);
                setVerticalSiblingAxis(verticalSiblingPath);
                setHorizontalSiblingAxis(horizontalSiblingPath);
                setNavigationAxis('x');

                // If is not descending, test if is a sibling instance to travel through Sibling Axis
            } else if (isInstanceSibling(currentInstance, prevInstanceRef.current, data)) {
                const movementAxis = getSiblingOrientation(currentInstance, prevInstanceRef.current, data);
                // If next instance is on vertical axis
                if (movementAxis === 'vertical') {
                    setNavigationAxis('y');
                    setHorizontalSiblingAxis(horizontalSiblingPath);
                } else if (movementAxis === 'horizontal') { // If next instance is on horizontal axis
                    setNavigationAxis('z');
                    setVerticalSiblingAxis(verticalSiblingPath);
                } else {
                    setNavigationAxis('y');
                    setNavigationAxis('z');
                    setVerticalSiblingAxis(verticalSiblingPath);
                    setHorizontalSiblingAxis(horizontalSiblingPath);
                }
                // If is not sibling, that means that user is trying to travel back to parent instance
            } else {
                let backPath = pathGenerator.createPath(currentInstance, prevInstanceRef.current);
                setIsNavDescending(false);
                setIsPathChanged(true);
                setPrevTargetPath(backPath);
                setTargetPath(backPath);
                setVerticalSiblingAxis(verticalSiblingPath);
                setHorizontalSiblingAxis(horizontalSiblingPath);
                setNavigationAxis('x');
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
            let doubleClickThreshold = 300; // Adjust this value based on your needs
            let mouseDownTimeout: any;
            let clickCount = 0;
            let lastClickTime = 0;

            window.addEventListener('mousedown', () => {
                isMousePressed = true;
                isLongClick = false;
                mouseDownTimeout = setTimeout(() => {
                    isLongClick = true;
                    setPlaceHover({ name: '', isSibling: false });
                }, longClickThreshold);
            });

            window.addEventListener('mouseup', () => {
                isMousePressed = false;
                clearTimeout(mouseDownTimeout);
                setTimeout(() => {
                    isLongClick = false;
                }, 100);
            });

            window.addEventListener('click', () => {
                const currentTime = Date.now();
                if (!isMousePressed && !isLongClick) {
                    if (currentTime - lastClickTime <= doubleClickThreshold) {
                        // Double click logic here
                        clickCount = 0; // Reset the click count
                        const instance = data.find((item: any) => item.key === instanceRef.current);
                        const instanceParent = instance?.parentKey;
                        const current = instance?.key;
                        if (instanceParent !== 'root') {
                            setPrevInstance(current);  // updating previous instance ref
                            pushToHistory(instanceParent);
                        }
                    } else {
                        clickCount++;
                    }

                    if (clickCount === 1) {
                        lastClickTime = currentTime;
                        setTimeout(() => {
                            if (clickCount === 1) {
                                // Single click logic here
                                const pathName = objectSelector.getCurrentSelection();
                                if (pathName !== 'no selections') {
                                    setPrevInstance(instanceRef.current);
                                    pushToHistory(pathName);
                                } else {
                                    console.log('you have to select something');
                                }
                            }
                            clickCount = 0; // Reset the click count
                        }, doubleClickThreshold + 50); // A slight delay to allow for double click detection
                    }
                }
            });

            // CONTROLS
            const objectTarget = new THREE.Object3D();
            const controls = Controls(camera, objectTarget, renderer3d, data);
            setControls(controls);

            let currentPath: any;
            let currentVerticalSiblingAxis: any;
            let currentHorizontalSiblingAxis: any;
            let nextControls: any;
            let prevControls: any;
            let currentControls: any;

            objectTarget.position.copy(generalTarget);
            let targetPosition = new THREE.Vector3();

            // LERP SETTINGS
            const lerpX = new LerpEngine();
            const lerpY = new LerpEngine();
            const lerpZ = new LerpEngine();
            const lerpHistory = new LerpEngine();
            let lerpXProgress: number;
            let lerpYProgress: number;
            let lerpZProgress: number;
            let historyProgress: number;
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
                                setPlaceHover({ name: selectedObject.name, isSibling: isSibling });
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
                lerpX.current = gsap.utils.interpolate(
                    lerpX.current,
                    lerpX.target,
                    lerpX.ease
                );
                lerpY.current = gsap.utils.interpolate(
                    lerpY.current,
                    lerpY.target,
                    lerpY.ease
                );
                lerpZ.current = gsap.utils.interpolate(
                    lerpZ.current,
                    lerpZ.target,
                    lerpZ.ease
                );
                lerpHistory.current = gsap.utils.interpolate(
                    lerpHistory.current,
                    lerpHistory.target,
                    lerpHistory.ease
                );

                lerpX.target = instanceLevelRef.current - 1;
                lerpY.target = siblingPositionRef.current.x;
                lerpZ.target = siblingPositionRef.current.y;
                lerpHistory.target = historyRef.current.length - 1;

                // GLITCH DETECTION
                prevCameraPosition.copy(camera.position);

                prevFramePath = currentPath;
                currentPath = targetPathRef.current;
                currentVerticalSiblingAxis = verticalSiblingAxisRef.current;
                if (currentPath !== prevFramePath) {
                    lerpXProgress = isNavDescendingRef.current ? 0 : 1;
                    historyProgress = isNavDescendingRef.current ? 0 : 1;
                } else {
                    lerpXProgress = lerpX.current - Math.floor(lerpX.current);
                    historyProgress = lerpHistory.current - Math.floor(lerpHistory.current);
                }
                lerpYProgress = lerpY.current;
                lerpZProgress = lerpY.current;

                // LERP BETWEEN CONTROLS
                nextControls = instanceControlsRef.current;
                prevControls = prevControlsRef.current;
                currentControls = lerpControls(prevControls, nextControls, historyProgress, isHistoryIncreasing.current);

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

                if (navigationAxisRef.current === 'y') {
                    currentVerticalSiblingAxis.getPointAt(lerpYProgress, targetPosition);
                    if (lerpYProgress >= 0.999) {
                        lerpYProgress = 1;
                        setIsPathChanged(false);
                    }
                    if (lerpYProgress <= 0.001) {
                        lerpYProgress = 0;
                        setIsPathChanged(false);
                    }
                } else if (navigationAxisRef.current === 'z') {
                    currentVerticalSiblingAxis.getPointAt(lerpZProgress, targetPosition);
                    if (lerpZProgress >= 0.999) {
                        lerpZProgress = 1;
                        setIsPathChanged(false);
                    }
                    if (lerpZProgress <= 0.001) {
                        lerpZProgress = 0;
                        setIsPathChanged(false);
                    }
                } else {
                    currentPath.getPointAt(lerpXProgress, targetPosition);
                    if (lerpXProgress >= 0.999) {
                        lerpXProgress = 1;
                        setIsPathChanged(false);
                    }
                    if (lerpXProgress <= 0.001) {
                        lerpXProgress = 0;
                        setIsPathChanged(false);
                    }
                };
                objectTarget.position.copy(targetPosition);

                if (historyProgress >= 0.999) {
                    historyProgress = 1;
                }
                if (historyProgress <= 0.001) {
                    historyProgress = 0;
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