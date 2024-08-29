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
import getModel from './Model'
import PathGenerator from './PathGenerator'
import Zonification from './Zonification'
import ObjectSelector from './ObjectSelector'
import { useExperienceContext } from '@/context/ExperienceContext'
import { LerpEngine, lerpControls } from './LerpEngine'
import { getCurrentInstance, isInstanceSibling } from './InstanceAnalyzer'
import {getTravelingData, getDefaultTravelingData} from './InstanceTraveler'

// Camera Positions
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
    const generalTarget = new THREE.Vector3(data[0]?.positionX, data[0]?.positionY, data[0]?.positionZ);

    const refBody = useRef<HTMLDivElement>(null)
    const [renderer3d, setRenderer3d] = useState<any>();
    const [renderer2d, setRenderer2d] = useState<any>();
    const [_camera, setCamera] = useState<any>();
    const [target, setTarget] = useState(generalTarget);
    const [scene] = useState(new THREE.Scene());
    const [_controls, setControls] = useState<any>();
    const [model, setModel] = useState<any>(false);
    const { placehover, setPlaceHover, history, pushToHistory, getLastHistoryItem, getPrevHistoryItem, setLoadingState, setLoadingProgress, travelingData, setTravelingData, loadingState } = useExperienceContext();
    const [isIntroCompleted, setIsIntroCompleted] = useState<boolean>(false);
    const isIntroCompletedRef = useRef<boolean>(isIntroCompleted);

    // NAVIGATION HOOKS
    const [currentInstance, setCurrentInstance] = useState<string>('main');
    const historyRef = useRef<string[]>(history);
    const instanceRef = useRef<string>(currentInstance);
    const [prevInstance, setPrevInstance] = useState<string>('intro');
    const prevInstanceRef = useRef<string>(prevInstance);
    const isHistoryIncreasing = useRef<boolean>(true);
    const travelingDataRef = useRef<any>(travelingData);

    // RESPONSIVE HOOKS
    const [isPortrait, setIsPortrait] = useState<boolean>(false);
    const isPortraitRef = useRef<any>(isPortrait);

    // POSITION HOOKS
    const [zones, setZones] = useState<any>([]);  // Declare zones state
    const zonesRef = useRef(zones);  // Declare zones ref

    // LOADING STATE REF
    const loadingStateRef = useRef<string>(loadingState);

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
            pushToHistory(instanceParent);
        }
        console.log('1- Handle Button Click');
    }, [isClicked]);

    // UPDATE CURRENT INSTANCE
    useEffect(() => {
        if (historyRef.current.length < history.length) { isHistoryIncreasing.current = true }
        else { isHistoryIncreasing.current = false }
        historyRef.current = history;
        setCurrentInstance(getLastHistoryItem());
        setPrevInstance(getPrevHistoryItem());
        console.log('2- Update Current Instance');
    }, [history]);

    // UPDATE TRAVELING DATA
    useEffect(() => {
        travelingDataRef.current = travelingData;
        console.log('3- Update Traveling Data');
    }, [travelingData]);

    // UPDATE ZONES
    useEffect(() => {
        zonesRef.current = zones;
        console.log('4- Update Zones');
    }, [zones]);

    // UPDATE INTRO STATE
    useEffect(() => {
        isIntroCompletedRef.current = isIntroCompleted;
        console.log('5- Update Intro State');
    }, [isIntroCompleted]);

    // UPDATE PORTRAIT / LANDSCAPE STATE
    useEffect(() => {
        isPortraitRef.current = isPortrait;
        console.log('6- Update Portrait/Landscape state');
    }, [isPortrait])

    // UPDATE LOADING STATE REF
    useEffect(() => {
        loadingStateRef.current = loadingState;
        console.log('7- Update Loading State Ref');
    }, [loadingState]);

    // CALL INSTANCE TRAVELER
    useEffect(() => {
        instanceRef.current = currentInstance;
        prevInstanceRef.current = prevInstance;
        if (Array.isArray(data) && data.length > 0) {
            const newTravelingData = getTravelingData(prevInstanceRef.current, currentInstance, data, pathGenerator);
            setTravelingData(newTravelingData);
        }
        console.log('8- Call Instance Traveller');
    }, [currentInstance, experienceContext.spaceData]);

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

            const camera = Camera(generalPosition, target, aspect);
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
                                    pushToHistory(pathName);
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

                // Check if the loading state is 'Office loaded' using ref
                if (!['started', 'Office loaded'].includes(loadingStateRef.current)) {
                    return; // If not in the desired states, skip the rendering logic
                }                

                frame = frame <= 100 ? frame + 1 : frame;

                // IS SELECTED?
                if (zonesRef.current && zonesRef.current.length > 0) {
                    objectSelector.update(zonesRef.current, camera, instanceRef.current, data);
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

                lerpX.target = travelingDataRef.current.originInstanceLevel - 1;
                lerpY.target = travelingDataRef.current.destinationInstanceSiblingPosition.x;
                lerpZ.target = travelingDataRef.current.destinationInstanceSiblingPosition.y;
                lerpHistory.target = historyRef.current.length - 1;

                // GLITCH DETECTION
                prevCameraPosition.copy(camera.position);

                prevFramePath = currentPath;
                currentPath = travelingDataRef.current.travelingPath;
                currentVerticalSiblingAxis = travelingDataRef.current.destinationSiblingAxis.verticalPath;
                currentHorizontalSiblingAxis = travelingDataRef.current.destinationSiblingAxis.horizontalPath;
                if (currentPath !== prevFramePath) {
                    lerpXProgress = travelingDataRef.current.isNavDescending ? 0 : 1;
                    historyProgress = isHistoryIncreasing? 0 : 1;
                } else {
                    lerpXProgress = lerpX.current - Math.floor(lerpX.current);
                    historyProgress = lerpHistory.current - Math.floor(lerpHistory.current);
                }
                lerpYProgress = lerpY.current;
                lerpZProgress = lerpZ.current;

                // LERP BETWEEN CONTROLS
                prevControls = travelingDataRef.current.originControls;
                nextControls = travelingDataRef.current.destinationControls;
                currentControls = lerpControls(prevControls, nextControls, historyProgress, isHistoryIncreasing.current);

                if (isPortraitRef.current) {
                    if (currentControls.maxDistance !== undefined) {
                        currentControls.maxDistance *= 2;
                    }
                    if (currentControls.minDistance !== undefined) {
                        currentControls.minDistance *= 2;
                    }
                }
                
                if (controls) {
                    if (currentControls?.maxDistance !== undefined) {
                        controls.maxDistance = currentControls.maxDistance;
                    }
                    if (currentControls?.minDistance !== undefined) {
                        controls.minDistance = currentControls.minDistance;
                    }
                    if (currentControls?.maxAzimuthAngle !== undefined) {
                        controls.maxAzimuthAngle = currentControls.maxAzimuthAngle;
                    }
                    if (currentControls?.minAzimuthAngle !== undefined) {
                        controls.minAzimuthAngle = currentControls.minAzimuthAngle;
                    }
                    if (currentControls?.maxPolarAngle !== undefined) {
                        controls.maxPolarAngle = Math.PI / currentControls.maxPolarAngle;
                    }
                    if (currentControls?.minPolarAngle !== undefined) {
                        controls.minPolarAngle = Math.PI / currentControls.minPolarAngle;
                    }
                }
                

                if (travelingDataRef.current.navigationAxis === 'vertical') {
                    currentVerticalSiblingAxis?.getPointAt(lerpYProgress, targetPosition);

                } else if (travelingDataRef.current.navigationAxis === 'horizontal') {
                    currentHorizontalSiblingAxis?.getPointAt(lerpZProgress, targetPosition);

                } else {
                    if (currentPath) {
                        currentPath.getPointAt(lerpXProgress, targetPosition);
                        console.log('updated')
                    }
                    if (lerpXProgress >= 0.999) {
                        lerpXProgress = 1;
                    }
                    if (lerpXProgress <= 0.001) {
                        lerpXProgress = 0;
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
            if (travelingData) {
                setLoadingState('Starting Engine');
                req = requestAnimationFrame(animate);
            }
            console.log('9- Experience Engine');

            return () => {
                console.log('unmount');
                cancelAnimationFrame(req);
                renderer3d.dispose();
            }
        };
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false);
        console.log('10- Handle Windows Rezise');

        return () => {
            window.removeEventListener('resize', handleWindowResize, false);
        }
    }, [renderer3d, handleWindowResize])

    return (
        <RenderView ref={refBody} />
    )
}

export default Experience
