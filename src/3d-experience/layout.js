import { EventEmitter } from "events";

export default class Layout extends EventEmitter {
    constructor() {

        const renderView = document.getElementById('renderView');

        super();
        this.width = renderView.offsetWidth;
        this.height = renderView.offsetHeight;
        this.aspect = this.width/this.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const {width, height} = entry.contentRect;
                let newWidth = renderView.offsetWidth;
                let newHeight = renderView.offsetHeight;
                this.width = newWidth;
                this.height = newHeight;
                this.aspect = this.width/this.height;
                this.pixelRatio = Math.min(window.devicePixelRatio, 2);

                this.emit('resize');
            }
        });

        observer.observe(renderView);
    }
}