import { GameObjectClass, getCanvas, on, Sprite, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { EVENT } from "../../constants/event";
import { GameManager } from "../../managers/game-manager";
import { tween } from "../../utils/tween-utils";
import { delay } from "../../utils/time-utils";
import { FONT } from "../../constants/text";
import { CustomButton } from "../dialog/shared-ui";
export class Header extends GameObjectClass {
    constructor() {
        super();
        const { width, height } = getCanvas();
        const title = Text({
            text: "移动 0",
            x: width / 2,
            y: 42,
            color: COLOR.GRAY_7,
            font: `36px ${FONT}`,
            anchor: { x: 0.5, y: 0.5 },
        });
        const enemyIndicator = Sprite({
            x: width / 2,
            y: height / 2,
            color: COLOR.BROWN_8,
            width: 600,
            height: 100,
            anchor: { x: 0.5, y: 0.5 },
            opacity: 0,
        });
        const enemyText = Text({
            text: "强大敌人来袭！",
            color: COLOR.WHITE_6,
            font: `36px ${FONT}`,
            anchor: { x: 0.5, y: 0.5 },
            opacity: 0,
        });
        enemyIndicator.addChild(enemyText);
        const gm = GameManager.gI();
        const soundButton = new GhostButton(width - 78, 60, "音效: 开");
        soundButton.bindClick(() => {
            gm.toggleBGM();
            soundButton.text.text = `音效: ${gm.music ? "开" : "关"}`;
        });
        const speedButton = new GhostButton(78, 60, "速度: 1倍");
        speedButton.bindClick(() => {
            gm.toggleSpeed();
            speedButton.text.text = `速度: ${gm.speed}倍`;
        });
        this.addChild([title, enemyIndicator, soundButton, speedButton]);
        on(EVENT.SWIPE, async () => {
            const gm = GameManager.gI();
            const move = gm.move;
            title.text = `移动 ${move}`;
            if (gm.isElite) {
                this.color = COLOR.RED_7;
                enemyText.opacity = 1;
                await tween(enemyIndicator, { opacity: 0.9 }, 500);
                await delay(800);
                await tween(enemyIndicator, { opacity: 0 }, 400);
                enemyText.opacity = 0;
            }
            else {
                this.color = COLOR.GRAY_7;
            }
        });
    }
}
class GhostButton extends CustomButton {
    constructor(x, y, text) {
        super(x, y, text);
        this.color = COLOR.WHITE_6;
        this.text.color = COLOR.GRAY_7;
    }
}
