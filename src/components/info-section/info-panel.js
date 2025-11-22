import { GameObjectClass, on, Sprite, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { Templar } from "../sprites/templar";
import { ItemPanel } from "./item-panel";
import { EVENT } from "../../constants/event";
import { FONT } from "../../constants/text";
import { TemplarClass } from "../../managers/game-manager";
export const INFO_PANEL_HEIGHT = 210;
export class InfoPanel extends GameObjectClass {
    constructor(x, y) {
        super({ x, y });
        const bg = Sprite({
            x: 0,
            y: 0,
            color: COLOR.YELLOW_6,
            width: this.context.canvas.width,
            height: INFO_PANEL_HEIGHT,
        });
        const textProps = {
            text: "",
            font: `14px ${FONT}`,
            color: COLOR.BROWN_7,
        };
        const cT = Text({
            x: 116,
            y: 12,
            strokeColor: COLOR.BROWN_8,
            lineWidth: 0.8,
            ...textProps,
        });
        const iT = Text({
            x: 116,
            y: 34,
            ...textProps,
        });
        const overweightConfig = { anchor: { x: 0.5, y: 0.5 }, opacity: 0 };
        const ow = Sprite({
            x: 56,
            y: 28,
            width: 100,
            height: 34,
            color: COLOR.RED_7,
            ...overweightConfig,
        });
        const owT = Text({
            ...textProps,
            color: COLOR.WHITE_6,
            text: "超重！",
            ...overweightConfig,
        });
        ow.addChild(owT);
        this.addChild([
            bg,
            new Templar({ x: 16, y: 74, condition: "i" }),
            new ItemPanel(116, 54),
            cT,
            iT,
            ow,
        ]);
        on(EVENT.UPDATE_TEMPLAR_CLASS, (cls) => {
            switch (cls) {
                case TemplarClass.W:
                    cT.text =
                        "法师: 攻击力和命中率较低，装备/组合药水可攻击所有敌人";
                    break;
                case TemplarClass.K:
                    cT.text = "骑士: 各项属性均衡，表现稳定";
                    break;
                case TemplarClass.D:
                    cT.text = "防御者: 攻击力较低，使用护盾进行反击";
                    break;
            }
        });
        on(EVENT.UPDATE_TEMPLAR_INFO, (templarCard) => {
            const texts = [
                `攻击: ${templarCard.attackType}, ${templarCard.attackDirection}`,
                `命中率: ${(templarCard.hitRate * 100).toFixed()}%`,
                `暴击率: ${(templarCard.critical * 100).toFixed()}%`,
                `击退: ${templarCard.hitBack}`,
            ];
            iT.text = texts.join(" | ");
        });
        on(EVENT.UPDATE_TEMPLAR_WEIGHT, (isOverweight) => {
            ow.opacity = isOverweight ? 1 : 0;
            owT.opacity = isOverweight ? 1 : 0;
        });
    }
}
