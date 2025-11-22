import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../utils/draw-utils";
import { COLOR } from "../../constants/color";
import { tween } from "../../utils/tween-utils";
export class Arrow extends GameObjectClass {
    constructor(x, y, type = "u") {
        super({ x, y });
        Object.defineProperty(this, "ing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.opacity = 0;
        this.type = type;
    }
    async play() {
        if (this.ing)
            return;
        this.ing = true;
        const currY = this.y;
        const currX = this.x;
        await tween(this, { scale: 2.5, targetX: currX - 14, targetY: currY - 6, opacity: 1 }, 200);
        const offset = this.type === "u" ? -50 : 50;
        tween(this, { targetY: currY + offset }, 600);
        await tween(this, { opacity: 0 }, 700);
        // reset
        this.setScale(1);
        this.x = currX;
        this.y = currY;
        this.opacity = 0;
        this.ing = false;
    }
    draw() {
        drawPolygon(this.context, this.type === "u"
            ? "11 0 0 11 0 18 11 8 22 18 22 11 11 0"
            : "11 18 22 7 22 0 11 10 0 0 0 7 11 18", this.type === "u" ? COLOR.WHITE_6 : COLOR.RED_6);
    }
}
export class Drop extends GameObjectClass {
    constructor(x, y) {
        super({ x, y });
        Object.defineProperty(this, "started", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "ing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.opacity = 0;
    }
    async loop() {
        while (this.started) {
            if (this.ing)
                return;
            this.ing = true;
            const currY = this.y;
            await Promise.all([
                tween(this, { opacity: 1 }, 200),
                tween(this, { targetY: currY + 16 }, 400),
            ]);
            await tween(this, { opacity: 0 }, 600);
            this.y = currY;
            this.ing = false;
        }
    }
    start() {
        this.started = true;
        this.loop();
    }
    stop() {
        this.started = false;
    }
    draw() {
        drawPolygon(this.context, "4 0 0 12 4 17 8 12 4 0", COLOR.BLUE_7);
    }
}
