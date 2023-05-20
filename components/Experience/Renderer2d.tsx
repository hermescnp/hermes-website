import React, { useEffect} from 'react'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import bloomEffect from '../../public/ui-assets/PNG/bloom-effect.png'

export default function Renderer3d(scW : number, scH : number, scene : any) {

    //SET 2D RENDERER

    const renderer = new CSS2DRenderer();
    renderer.setSize(scW, scH);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none';

    const img1 = document.createElement('img');
    img1.classList.add("BloomEffect");
    img1.setAttribute("src", bloomEffect.src);

    const img2 = document.createElement('img');
    img2.classList.add("BloomEffect");
    img2.setAttribute("src", bloomEffect.src);

    const img3 = document.createElement('img');
    img3.classList.add("BloomEffect");
    img3.setAttribute("src", bloomEffect.src);

    const bloom1 = new CSS2DObject(img1);
    scene.add(bloom1);
    bloom1.position.set(1.63, 4.55, -0.59);

    const bloom2 = new CSS2DObject(img2);
    scene.add(bloom2);
    bloom2.position.set(0.67, 3.91, -2.62);

    const bloom3 = new CSS2DObject(img3);
    scene.add(bloom3);
    bloom3.position.set(0.51, 4.18, -1.29);

  return (
    renderer
  )
}
