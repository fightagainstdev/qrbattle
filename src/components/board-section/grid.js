import { SpriteClass } from "kontra";
import { COLOR } from "../../constants/color";
import { GRID_SIZE } from "../../constants/size";
export class Grid extends SpriteClass {
    constructor({ x, y, coord }) {
        super({
            x,
            y,
            width: GRID_SIZE,
            height: GRID_SIZE,
            color: COLOR.GRAY_6,
            anchor: { x: 0.5, y: 0.5 },
        });
        Object.defineProperty(this, "coord", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.coord = coord;
    }
}
