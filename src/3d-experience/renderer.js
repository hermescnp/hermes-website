import * as THREE from 'three';
import Experience from '../experience';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.layout = this.experience.layout;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        this.setRenderer();
        this.set2DRenderer();

        // RENDER PASS - BLOOM EFFECT
        // this.renderScene = new RenderPass(this.scene, this.camera.perspectiveCamera);
        // this.bloomComposer = new EffectComposer(this.renderer);
        // this.bloomComposer.addPass(this.renderScene);
        // this.bloomComposer.renderToScreen = false;
        // this.bloomPass = new UnrealBloomPass(
        //     new THREE.Vector2(this.layout.width, this.layout.height),
        //     1.6
        // );
        // this.bloomPass.threshold = 0.90;
        // this.bloomPass.strength = 1;
        // this.bloomPass.radius = 0.7;
        // this.bloomComposer.addPass(this.bloomPass);
        // this.bloomComposer.renderToScreen = true;
    }

    setRenderer() {

        let pixelRatio = window.devicePixelRatio;
        let AA = true;
        if (pixelRatio > 1) {
        AA = false
        };

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
            logarithmicDepthBuffer: true,
            alpha: true
        });

        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = 0;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.CineonToneMapping[ 'ACESFilmic' ];
        //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.setSize(this.layout.width, this.layout.height);
        this.renderer.setPixelRatio(this.layout.pixelRatio*0.75);

    }

    set2DRenderer() {
        this.flatRenderer = new CSS2DRenderer();
        this.flatRenderer.setSize(this.layout.width, this.layout.height);
        this.flatRenderer.domElement.style.position = 'absolute';
        this.flatRenderer.domElement.style.top = '0px';
        this.flatRenderer.domElement.style.pointerEvents = 'none';
        const renderView = document.getElementById('renderView');
        renderView.appendChild(this.flatRenderer.domElement);

        const img1 = document.createElement('img');
        img1.classList.add("BloomEffect");
        img1.setAttribute("src", "../src/Assets/PNG/bloom-effect.png");

        const img2 = document.createElement('img');
        img2.classList.add("BloomEffect");
        img2.setAttribute("src", "../src/Assets/PNG/bloom-effect.png");

        const img3 = document.createElement('img');
        img3.classList.add("BloomEffect");
        img3.setAttribute("src", "../src/Assets/PNG/bloom-effect.png");

        const bloom1 = new CSS2DObject(img1);
        this.scene.add(bloom1);
        bloom1.position.set(1.63, 4.55, -0.59);

        const bloom2 = new CSS2DObject(img2);
        this.scene.add(bloom2);
        bloom2.position.set(0.67, 3.91, -2.62);

        const bloom3 = new CSS2DObject(img3);
        this.scene.add(bloom3);
        bloom3.position.set(0.51, 4.18, -1.29);
    }

    resize() {
        this.renderer.setSize(this.layout.width, this.layout.height);
        this.renderer.setPixelRatio(this.layout.pixelRatio*0.75);
        this.flatRenderer.setSize(this.layout.width, this.layout.height);
        // this.bloomComposer.setSize(this.layout.width, this.layout.height);
        // this.finalComposer.setSize(this.layout.width, this.layout.height);
    }

    update() {
        this.renderer.render(this.scene, this.camera.perspectiveCamera);
        this.flatRenderer.render(this.scene, this.camera.perspectiveCamera);
        //this.bloomComposer.render();
        //this.finalComposer.render();
    }

}
