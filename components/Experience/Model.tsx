import React from 'react'
import * as THREE from 'three'
import Resources from './Resources'
import assets from '../../public/experience-assets'
import alphaTextureFile from '../../public/textures/Follaje_Diffuse-Alpha.png'

export default function getModel(scene : any) {

    const resources = new Resources();
    resources.startLoading(assets)
      .then(() => {
        const model : any = resources.getItems().room;
        model.scene.traverse((child : any) => {

            if (child.name === 'Object_777') {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: resources.getItems().screenA,
                })
            }
            if (child.name === 'Object_17') {
                const textureLoader : any = new THREE.TextureLoader();
                const textureAlpha = textureLoader.load(alphaTextureFile.src);
                child.material = new THREE.MeshPhongMaterial({
                    map: textureAlpha,
                })
                child.material.transparent = true;
                child.material.alphaTest = 0.5;
            }
        })
    
        scene.add(model.scene);

      })
      .catch((error) => {
        console.error('Error loading assets:', error);
      });
}
