import * as THREE from 'three';
import Experience from '../experience';

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.layout = this.experience.layout;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        this.setRenderer();
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
        });

        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = 0;
        this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.CineonToneMapping[ 'ACESFilmic' ];
        this.renderer.setSize(this.layout.width, this.layout.height);
        this.renderer.setPixelRatio(this.layout.pixelRatio*0.75);

    }

    resize() {
        this.renderer.setSize(this.layout.width, this.layout.height);
        this.renderer.setPixelRatio(this.layout.pixelRatio*0.75);
    }

    update() {
        this.renderer.render(this.scene, this.camera.perspectiveCamera)
    }

}
