import * as THREE from 'three';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import Layout from './3d-experience/layout';
import Time from './3d-experience/time';
import Resources from './3d-experience/resources';
import assets from './3d-experience/assets';

import Camera from './3d-experience/cameras';
import Renderer from './3d-experience/renderer';

import World from './3d-experience/world/world';

export default class Experience {
    static instance;
    constructor(canvas) {
        if(Experience.instance){
            return Experience.instance;
        }
        Experience.instance = this;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.time = new Time();
        this.layout = new Layout();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resources = new Resources(assets);
        this.world = new World();

        //BACKGROUND SETTINGS

        const color = new THREE.Color();
        color.set(0x1f2637);
        if (this.layout.width < this.layout.height) {
            this.scene.fog = new THREE.Fog(color, 30, 50);
        } else {
            this.scene.fog = new THREE.Fog(color, 15, 50);
        }

        this.hdrEquirect = new RGBELoader();
        this.hdrEquirect.load(
            "/textures/night-environment.hdr", (hdri) => {
                hdri.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = hdri;
                this.scene.environment = hdri;
                this.scene.background = color;
                this.scene.rotation.y = Math.PI / 12 
            }
        );

        this.layout.on('resize', ()=>{
            this.resize();
        })

        this.time.on('update', ()=>{
            this.update();
        })
    }

    resize(){
        this.camera.resize();
        this.world.resize();
        this.renderer.resize();
    }

    update(){
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }
}