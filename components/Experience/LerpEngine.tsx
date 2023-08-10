import React from 'react'
import * as THREE from 'three';

export default class LerpEngine {
    current: number;
    target: number;
    ease: number;

    constructor() {
        this.current = 0;
        this.target = 0;
        this.ease = 0.05;
    }

    reset = () => {
        this.current = 0;
        this.target = 0;
        this.ease = 0.05;
    }
}
