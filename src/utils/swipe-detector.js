export class SwipeDetector {
    constructor(options) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "startX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "startY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "threshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        });
        this.addEventListeners();
    }
    addEventListeners() {
        window.addEventListener("touchstart", this.onStart.bind(this));
        window.addEventListener("touchend", this.onEnd.bind(this));
        window.addEventListener("touchmove", this.preventDefault.bind(this));
    }
    onStart(event) {
        const point = this.getPoint(event);
        this.startX = point.clientX;
        this.startY = point.clientY;
    }
    onEnd(event) {
        const point = this.getPoint(event);
        const diffX = point.clientX - this.startX;
        const diffY = point.clientY - this.startY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.threshold) {
            diffX > 0 ? this.options.onSwipeRight?.() : this.options.onSwipeLeft?.();
        }
        else if (Math.abs(diffY) > this.threshold) {
            diffY > 0 ? this.options.onSwipeDown?.() : this.options.onSwipeUp?.();
        }
    }
    getPoint(event) {
        return event instanceof TouchEvent ? event.changedTouches[0] : event;
    }
    preventDefault(event) {
        event.preventDefault();
    }
}
