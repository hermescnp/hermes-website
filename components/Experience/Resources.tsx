import React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

export default class Resources {

    private items: { [key: string]: any } = {};

    constructor() {
    }

    getItems(): { [key: string]: any } {
        return this.items;
    }

    startLoading(assets: any, loadingManager: any) {

        const gltfLoader = new GLTFLoader(loadingManager);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        gltfLoader.setDRACOLoader(dracoLoader);
      
        const promises = assets.map((asset: any) => {
          return new Promise<void>((resolve) => {
            if (asset.type === 'glbModel') {
              gltfLoader.load(asset.path, (model) => {
                this.singleAssetLoaded(asset.name, model);
                resolve();
              });
            }
      
            if (asset.type === 'videoTexture') {
              const video = document.createElement('video');
              video.src = asset.path;
              video.muted = true;
              //video.playInline = true;
              video.autoplay = true;
              video.loop = true;
              video.play();
      
              const videoTexture = new THREE.VideoTexture(video);
              videoTexture.flipY = true;
              videoTexture.minFilter = THREE.NearestFilter;
              videoTexture.magFilter = THREE.NearestFilter;
              videoTexture.generateMipmaps = false;
      
              this.singleAssetLoaded(asset.name, videoTexture);
              resolve();
            }
          });
        });
      
        return Promise.all(promises);
      }
      
      
      
      singleAssetLoaded(assetName: string, asset: any) {
        this.items[assetName] = asset;
      }
      
}

