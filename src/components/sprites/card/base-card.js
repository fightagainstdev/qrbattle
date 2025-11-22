import { Sprite, SpriteClass } from "kontra";
import { GRID_SIZE } from "../../../constants/size";
import { COLOR } from "../../../constants/color";
import { CardType } from "./type";
import { tween } from "../../../utils/tween-utils";
var CardPart;
(function (CardPart) {
    CardPart[CardPart["B"] = 0] = "B";
    CardPart[CardPart["C"] = 1] = "C";
})(CardPart || (CardPart = {}));
export class BaseCard extends SpriteClass {
    constructor({ type, x, y }) {
        super({
            x,
            y,
            width: GRID_SIZE,
            height: GRID_SIZE,
            anchor: { x: 0.5, y: 0.5 },
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "main", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isActive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "circle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.type = type;
        this.setScale(0);
        this.main = Sprite({
            width: GRID_SIZE,
            height: GRID_SIZE,
            color: getCardColor(type, CardPart.B),
            anchor: { x: 0.5, y: 0.5 },
        });
        this.addChild(this.main);
        const isTemplar = type === CardType.T;
        this.circle = Sprite({
            radius: isTemplar ? 28 : 24,
            color: getCardColor(type, CardPart.C),
            anchor: { x: 0.5, y: 0.5 },
            y: isTemplar ? -4 : this.type === CardType.E ? -14 : -20,
        });
        const mainIcon = this.getMainIcon();
        this.main.addChild([this.circle, mainIcon]);
    }
    async moveTo(x, y) {
        await tween(this, { targetX: x, targetY: y }, 100);
    }
    async setInactive(ms = 200) {
        await this.setChildrenOpacity(0, ms);
        this.isActive = false;
    }
    async setActive(x, y) {
        this.x = x;
        this.y = y;
        await this.setChildrenOpacity(1, 200);
        this.isActive = true;
    }
    reset() {
        this.isActive = true;
        this.setChildrenOpacity(1, 0);
        this.setScale(0);
        this.resetProps();
    }
    async setChildrenOpacity(opacity, duration) {
        await Promise.all([
            tween(this, { opacity }, duration),
            tween(this.main, { opacity }, duration),
            ...this.children.map((child) => tween(child, { opacity }, duration)),
            ...this.main.children.map((child) => tween(child, { opacity }, duration)),
        ]);
    }
    update() {
        // When generating the card
        if (this.scaleX <= 1) {
            this.scaleX += 0.1;
            this.scaleY += 0.1;
            if (this.scaleX > 1)
                this.setScale(1);
        }
    }
    render() {
        if (this.opacity < 0)
            return;
        super.render();
    }
}
// Utils
function getCardColor(type, part) {
    switch (type) {
        case CardType.T:
            switch (part) {
                case CardPart.B:
                    return COLOR.YELLOW_7;
                case CardPart.C:
                    return COLOR.YELLOW_6;
            }
        case CardType.E:
            switch (part) {
                case CardPart.B:
                    return COLOR.RED_7;
                case CardPart.C:
                    return COLOR.RED_6;
            }
        case CardType.W:
            switch (part) {
                case CardPart.B:
                    return COLOR.BLUE_7;
                case CardPart.C:
                    return COLOR.BLUE_6;
            }
        case CardType.S:
            switch (part) {
                case CardPart.B:
                    return COLOR.BROWN_7;
                case CardPart.C:
                    return COLOR.BROWN_6;
            }
        case CardType.P:
            switch (part) {
                case CardPart.B:
                    return COLOR.GREEN_6;
                case CardPart.C:
                    return COLOR.GREEN_5;
            }
    }
}
