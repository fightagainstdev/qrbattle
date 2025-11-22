import { Belongs, CardType } from "./type";
import { Templar } from "../templar";
import { CharacterCard } from "./character-card";
import { AttackDirection, AttackType } from "../../../types/character";
import { emit, on, Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { WeightIcon } from "../icons/weight-icon";
import { COLOR } from "../../../constants/color";
import { EVENT } from "../../../constants/event";
import { GameManager } from "../../../managers/game-manager";
export class TemplarCard extends CharacterCard {
    constructor({ x, y }) {
        super({
            type: CardType.T,
            x,
            y,
            belongs: Belongs.PLAYER,
        });
        Object.defineProperty(this, "weight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "wT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // weight text
        this.resetProps();
        this.wT = Text({
            text: `${this.weight}`,
            x: -24,
            y: 40,
            ...COMMON_TEXT_CONFIG,
        });
        this.main.addChild([new WeightIcon(-46, 32), this.wT]);
        on(EVENT.UPDATE_TEMPLAR_CLASS, this.updateCls.bind(this));
    }
    getMainIcon() {
        const templar = new Templar({
            x: -21,
            y: -30,
            condition: "b",
        });
        return templar;
    }
    deathCallback() {
        const gm = GameManager.gI();
        gm.gameOver();
    }
    updateCls(cls) {
        this.cls = cls;
        this.resetProps();
    }
    resetProps() {
        const { isD, isK, isW } = GameManager.gI();
        this.health = isW ? 6 : 10;
        this.shield = isD ? 10 : 0;
        this.attack = isK ? 4 : 1;
        this.hitRate = isW ? 0.65 : 0.8;
        this.critical = 0.1;
        this.attackDirection = AttackDirection.F;
        this.attackType = AttackType.N;
        this.hitBack = isD ? this.shield : 0;
        if (isD)
            this.updateWeight(3);
        this.refreshText();
        emit(EVENT.UPDATE_TEMPLAR_INFO, this);
    }
    updateWeight(value) {
        this.weight += value;
        this.wT.text = `${this.weight}`;
        const isOverweight = this.weight >= 13;
        this.wT.color = isOverweight ? COLOR.BROWN_8 : COLOR.WHITE_6;
        emit(EVENT.UPDATE_TEMPLAR_WEIGHT, isOverweight);
    }
}
