import { getCanvas, Sprite, SpriteClass, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { FONT } from "../../constants/text";
export class OverlayDialog extends SpriteClass {
    constructor(width, height) {
        const { width: w, height: h } = getCanvas();
        super({
            width: w,
            height: h,
            opacity: 0.8,
            color: COLOR.DARK_6,
        });
        Object.defineProperty(this, "wrapper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // title text
        Object.defineProperty(this, "dT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // description text
        this.wrapper = Sprite({
            x: w / 2,
            y: h / 2,
            width,
            height,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.YELLOW_6,
        });
        this.tT = Text({
            text: "",
            x: w / 2,
            y: h / 2 - 52,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.BROWN_7,
            font: `24px ${FONT}`,
        });
        this.dT = Text({
            text: "",
            x: w / 2,
            y: h / 2,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.BROWN_7,
            font: `16px ${FONT}`,
            textAlign: "center",
            lineHeight: 1.2,
        });
        this.addChild([this.wrapper, this.tT, this.dT]);
    }
}
export class CustomButton extends SpriteClass {
    constructor(x, y, text, isDisabled = false) {
        super({
            x,
            y,
            width: 96,
            height: 28,
            color: COLOR.BROWN_7,
            anchor: { x: 0.5, y: 0.5 },
            opacity: isDisabled ? 0.3 : 1,
        });
        Object.defineProperty(this, "isDisabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canvasCallback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.isDisabled = isDisabled;
        this.text = Text({
            text,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.WHITE_6,
            font: `16px ${FONT}`,
        });
        this.addChild(this.text);
    }
    bindClick(callback) {
        if (this.isDisabled)
            return;
        const canvas = getCanvas();
        this.canvasCallback = (event) => {
            const isClicked = detectCanvasClick(event, this);
            if (isClicked)
                callback();
        };
        canvas.addEventListener("pointerdown", this.canvasCallback);
    }
    offClick() {
        if (this.canvasCallback) {
            getCanvas().removeEventListener("pointerdown", this.canvasCallback);
        }
    }
}
export function detectCanvasClick(event, sprite) {
    const { offsetLeft, offsetTop } = event.target;
    const { world } = sprite;
    const minX = world.x - world.width / 2;
    const maxX = world.x + world.width / 2;
    const minY = world.y - world.height / 2;
    const maxY = world.y + world.height / 2;
    const { width: w, height: h } = getCanvas();
    const scale = Math.min(innerWidth / w, innerHeight / h, devicePixelRatio);
    const x = (event.x - offsetLeft) / scale;
    const y = (event.y - offsetTop) / scale;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}
