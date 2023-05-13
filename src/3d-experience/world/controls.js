import * as THREE from 'three';
import Experience from '../../experience';
import { setMode } from '../../script';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

export default class Controls {
    constructor(MODE) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;

        // Camera Positions
        this.introStartPosition = new THREE.Vector3(-70.0, 0.0, 0.0);
        this.introEndPosition = new THREE.Vector3(-17.0, 0.0, 0.0);
        this.generalPosition = new THREE.Vector3(-11.0, 6.0, 11.0);
        this.generalPositionOffset = new THREE.Vector3(-23.0, 6.0, 23.0);
        this.studioPosition = new THREE.Vector3(-4.5, 3.0, 5.5);
        this.lobbyPosition = new THREE.Vector3(-5.0, 2.0, 5.0);
        this.libraryPosition = new THREE.Vector3(-2.8, 2.5, 5.0);
        this.stairsPosition = new THREE.Vector3(-6.0, 2.5, 2.0);
        this.secondFloorPosition = new THREE.Vector3(-5.0, 5.0, 3.0);

        // Camera Targets
        this.generalTarget = new THREE.Vector3(0.0, 2.0, 0.0);
        this.studioTarget = new THREE.Vector3(0.7, 1.5, 2.0);
        this.lobbyTarget = new THREE.Vector3(-1.7, 1.2, 1.8);
        this.libraryTarget = new THREE.Vector3(-1.3, 1.0, -2.8);
        this.stairsTarget = new THREE.Vector3(-2.5, 2.2, -2.0);
        this.secondFloorTarget = new THREE.Vector3(-1.8, 4.30, 1.5);

        this.objectTarget = new THREE.Object3D();

        // Camera Pivot
        this.cameraPivot = new THREE.Object3D();

        this.pathMode = MODE;
        this.modeChanged = false;

        if (this.pathMode === 'intro') {
            this.progress = 0;
            this.cameraPosition =  new THREE.Vector3(-70.0, 0.0, 0.0);
            this.cameraTarget = new THREE.Vector3(0.0, 2.0, 0.0);
            this.objectTarget.position.copy(new THREE.Vector3(0.0, 2.0, 0.0));
        }

        else if (this.pathMode === 'story') {
            this.cameraPivot.add(this.camera.perspectiveCamera);
            this.scene.add(this.cameraPivot);
            this.storyStep = 0;
            this.cameraPosition =  new THREE.Vector3(-11.0, 6.0, 11.0);
            this.cameraTarget = new THREE.Vector3(0.0, 2.0, 0.0);
            this.camera.perspectiveCamera.position.copy(new THREE.Vector3(0, 0, 0));
            this.objectTarget.position.copy(new THREE.Vector3(0.0, 2.0, 0.0));
            setTimeout(()=>{this.onContinue()}, 3000);
        }

        else if (this.pathMode === 'explore') {
            this.cameraPosition =  new THREE.Vector3(-11.0, 6.0, 11.0);
            this.cameraTarget = new THREE.Vector3(0.0, 2.0, 0.0);
            this.setOrbitControls();
            this.onTap()
        }

        else {
            this.pendulumState = Math.PI/2;
            this.pendulumSwitch = false;
            this.cameraPosition =  new THREE.Vector3(-11.0, 6.0, 11.0);
            this.cameraTarget = new THREE.Vector3(0.0, 2.0, 0.0);
            this.objectTarget.position.copy(new THREE.Vector3(0.0, 2.0, 0.0));
        }

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.05,
        };

        this.goToStartPoint();
        this.setPath();
    }

    setOrbitControls() {
        this.orbit = new OrbitControls(this.camera.perspectiveCamera, this.canvas);

        if (this.experience.layout.width < this.experience.layout.height) {
            this.camera.perspectiveCamera.position.copy(this.generalPositionOffset);
        } else {
            this.camera.perspectiveCamera.position.copy(this.generalPosition);
        }
        this.orbit.target0 = this.generalTarget;
        this.orbit.target = this.generalTarget;
        this.orbit.enableZoom = false;
        this.orbit.enableDamping = true;
        this.orbit.dampingFactor = 0.08;
        this.orbit.enableRotate = true;
        this.orbit.rotateSpeed = 0.40;
        this.orbit.enablePan = false;
        this.orbit.minAzimuthAngle = -1.7;
        this.orbit.maxAzimuthAngle = 0.1;
        this.orbit.minPolarAngle = Math.PI/4;
        this.orbit.maxPolarAngle = Math.PI/2;
    }

    setPath() {

//______________________________________________________________________________________________________________________________________________________________________
        if (this.pathMode === 'intro') {
            this.introCurve = new THREE.CatmullRomCurve3( [
                new THREE.Vector3(-70.0, 0.0, 0.0),
                new THREE.Vector3(-17.0, 0.5, 0.0),
                new THREE.Vector3(-11.0, 2.0, 11.0),
                new THREE.Vector3(-3.0, 15.0, 22.0)
            ], false );
    
            const points = this.introCurve.getPoints( 50 );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
            const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
            material.visible = false;
    
            const curveObject = new THREE.Line( geometry, material );
            this.scene.add(curveObject);

            this.lerp.current = this.progress;
        }
//______________________________________________________________________________________________________________________________________________________________________
        else if (this.pathMode === 'story') {
        
        // POSITION CURVE
        
        this.storyPositions = [this.generalPosition, this.studioPosition, this.lobbyPosition, this.libraryPosition, this.stairsPosition, this.secondFloorPosition];
        this.storyPositionPaths = [];

        for(let i = 0; i < this.storyPositions.length; i++) {

            if (i + 1 !== this.storyPositions.length) {

                this.positionCurve = new THREE.CatmullRomCurve3( [
                    this.storyPositions[i],
                    this.storyPositions[i+1]
                ], false );
        
                const points1 = this.positionCurve.getPoints( 50 );
                const geometry1 = new THREE.BufferGeometry().setFromPoints( points1 );
        
                const material1 = new THREE.LineBasicMaterial( { color: 0xff0000 } );
                material1.visible = false;
        
                const curveObject1 = new THREE.Line( geometry1, material1 );
                this.scene.add(curveObject1);
                this.storyPositionPaths.push(this.positionCurve);

            } else {

                this.positionCurve = new THREE.CatmullRomCurve3( [
                    this.storyPositions[i],
                    this.storyPositions[0]
                ], false );
        
                const points1 = this.positionCurve.getPoints( 50 );
                const geometry1 = new THREE.BufferGeometry().setFromPoints( points1 );
        
                const material1 = new THREE.LineBasicMaterial( { color: 0xff0000 } );
                material1.visible = false;
        
                const curveObject1 = new THREE.Line( geometry1, material1 );
                this.scene.add(curveObject1);
                this.storyPositionPaths.push(this.positionCurve);
            }
        }

        // TARGET CURVE

        this.storyTargets = [this.generalTarget, this.studioTarget, this.lobbyTarget, this.libraryTarget, this.stairsTarget, this.secondFloorTarget];
        this.storyTargetPaths = [];

        for(let i = 0; i < this.storyTargets.length; i++) {

            if (i + 1 !== this.storyTargets.length) {

                this.targetCurve = new THREE.CatmullRomCurve3( [
                    this.storyTargets[i],
                    this.storyTargets[i+1]
                ], false );
        
                const points2 = this.targetCurve.getPoints( 50 );
                const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
        
                const material2 = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
                material2.visible = false;
        
                const curveObject2 = new THREE.Line( geometry2, material2 );
                this.scene.add(curveObject2);
                this.storyTargetPaths.push(this.targetCurve);

            } else {

                this.targetCurve = new THREE.CatmullRomCurve3( [
                    this.storyTargets[i],
                    this.storyTargets[0]
                ], false );
        
                const points2 = this.targetCurve.getPoints( 50 );
                const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
        
                const material2 = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
                material2.visible = false;
        
                const curveObject2 = new THREE.Line( geometry2, material2 );
                this.scene.add(curveObject2);
                this.storyTargetPaths.push(this.targetCurve);
            }
        }
        }
//______________________________________________________________________________________________________________________________________________________________________
        else if (this.pathMode === 'explore') {}
//______________________________________________________________________________________________________________________________________________________________________
        else {
            this.pendulumCurve = new THREE.CatmullRomCurve3( [
                new THREE.Vector3(-18.0, 9.0, 0.0),
                new THREE.Vector3(-11.0, 2.0, 11.0),
                new THREE.Vector3(-3.0, 15.0, 22.0)
            ], false );
    
            const points = this.pendulumCurve.getPoints( 50 );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
            const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
            material.visible = false;
    
            const curveObject = new THREE.Line( geometry, material );
            this.scene.add(curveObject);
        }
    }

    goToStartPoint() {}

    onContinue() {
        window.addEventListener('click', () => {

            if (this.lerp.target === 0) {
                this.lerp.target = 1;

                setTimeout(()=>{
                    if (this.storyStep + 1 < this.storyTargets.length) {this.storyStep++}
                    else {this.storyStep = 0};
                    this.lerp.current = 0;
                    this.lerp.target = 0;

                }, 2500);
            } else {console.log('Action Blocked')}
        })
    }

    onTap() {}

    resize() {}

    update() {
        this.lerp.current = gsap.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        this.lerp.target = gsap.utils.clamp(0, 1, this.lerp.target);
        this.lerp.current = gsap.utils.clamp(0, 1, this.lerp.current);

        if (this.pathMode === 'intro') {
            this.introCurve.getPointAt(this.lerp.current, this.cameraPosition);
            this.lerp.target += 0.002;
            this.camera.perspectiveCamera.lookAt(this.objectTarget.position);
            this.camera.perspectiveCamera.position.copy(this.cameraPosition);

            if (this.lerp.target >= 1) {
                if (this.modeChanged === false) {
                    console.log('the intro has finished');
                    setTimeout(()=> {
                        setMode('none');
                    }, 1000);
                    this.modeChanged = true;
                }
            }
        }

        else if (this.pathMode === 'story') {

            this.storyPositionPaths[this.storyStep].getPointAt(this.lerp.current, this.cameraPosition);
            this.storyTargetPaths[this.storyStep].getPointAt(this.lerp.current, this.cameraTarget);
            //Set curves to camera;
            this.cameraPivot.position.copy(this.cameraPosition);
            this.objectTarget.position.copy(this.cameraTarget);
            this.objectTarget.position.y += this.experience.world.lerp.currentY/2;
            this.camera.perspectiveCamera.lookAt(this.objectTarget.position);
        }

        else if (this.pathMode === 'explore') {
            this.orbit.update();
        }

        else {
            this.pendulumCurve.getPointAt((Math.sin(this.pendulumState)+1)/2, this.cameraPosition);
            if (this.pendulumState > Math.PI/2) {this.pendulumSwitch = false};
            if (this.pendulumState < -Math.PI/2) {this.pendulumSwitch = true};
            if (this.pendulumSwitch === true) {this.pendulumState += 0.001} else {this.pendulumState -= 0.001};
            this.camera.perspectiveCamera.lookAt(this.objectTarget.position);
            this.camera.perspectiveCamera.position.copy(this.cameraPosition);
        }
    }

}