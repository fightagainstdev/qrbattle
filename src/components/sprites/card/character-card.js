import { emit, Sprite, SpriteClass, Text } from "kontra";
import { SwordIcon } from "../icons/sword-icon";
import { BaseCard } from "./base-card";
import { CardType } from "./type";
import { HeartIcon } from "../icons/heart-icon";
import { ShieldIcon } from "../icons/shield-icon";
import { tween } from "../../../utils/tween-utils";
import { Direction } from "../../../types/direction";
import { AttackDirection, AttackType, } from "../../../types/character";
import { COMMON_TEXT_CONFIG, FONT } from "../../../constants/text";
import { COLOR } from "../../../constants/color";
import { zzfx } from "../../../audios/zzfx";
import { delay } from "../../../utils/time-utils";
import { EVENT } from "../../../constants/event";
import { GameManager } from "../../../managers/game-manager";
import { GRID_SIZE } from "../../../constants/size";
import { attackSFX, makeUpgradeSFX, negativeSFX } from "../../../audios/sfx";
import { checkIfBuff } from "../../../utils/buff-utils";
export class CharacterCard extends BaseCard {
    constructor({ type, x, y, belongs }) {
        super({ type, x, y });
        Object.defineProperty(this, "dmBg", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "aT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // attack text
        Object.defineProperty(this, "hT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // health text
        Object.defineProperty(this, "sT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // shield text
        Object.defineProperty(this, "iT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // impact text
        Object.defineProperty(this, "belongs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "health", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "shield", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "attack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "hitRate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "critical", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "attackDirection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: AttackDirection.F
        });
        Object.defineProperty(this, "hitBack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "attackType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: AttackType.N
        });
        this.belongs = belongs;
        this.color = COLOR.DARK_6;
        this.dmBg = Sprite({
            x: 0,
            y: 0,
            width: GRID_SIZE,
            height: GRID_SIZE,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.WHITE_6,
            opacity: 0,
        });
        this.aT = Text({
            text: `${this.attack}`,
            x: 42,
            y: 39,
            ...COMMON_TEXT_CONFIG,
        });
        this.hT = Text({
            text: `${this.health}`,
            x: -33,
            y: -34,
            ...COMMON_TEXT_CONFIG,
        });
        this.sT = Text({
            text: `${this.shield}`,
            x: 37,
            y: -34,
            ...COMMON_TEXT_CONFIG,
        });
        this.iT = new ImpactText(0);
        this.main.addChild([
            this.dmBg,
            new SwordIcon(20, 30),
            this.aT,
            new HeartIcon(-45.5, -45.5),
            this.hT,
            new ShieldIcon(28, -46),
            this.sT,
            this.iT,
        ]);
    }
    async execAttack(direction, target, isHitBack = false, isPenetrate = false) {
        if (target.health <= 0 || this.health <= 0)
            return;
        const origX = this.x;
        const origY = this.y;
        await tween(this.main, { targetX: -5, targetY: -10 }, 100, 700);
        if ([Direction.R, Direction.L].includes(direction)) {
            const xFactor = direction === Direction.R ? -1 : 1;
            await tween(this, { targetX: this.x + 10 * xFactor, targetY: this.y }, 50);
            await tween(this, { targetX: this.x - 30 * xFactor, targetY: this.y }, 40);
        }
        else {
            const yFactor = direction === Direction.D ? -1 : 1;
            await tween(this, { targetX: this.x, targetY: this.y + 10 * yFactor }, 50);
            await tween(this, { targetX: this.x, targetY: this.y - 30 * yFactor }, 40);
        }
        if (this.type === CardType.T)
            emit(EVENT.TEMPLAR_ATTACK);
        zzfx(...attackSFX);
        await tween(this, { targetX: origX, targetY: origY }, 50, 400);
        const counterDirection = () => {
            switch (direction) {
                case Direction.R:
                    return Direction.L;
                case Direction.L:
                    return Direction.R;
                case Direction.U:
                    return Direction.D;
                case Direction.D:
                    return Direction.U;
            }
        };
        await Promise.all([
            tween(this.main, { targetX: 0, targetY: 0 }, 200),
            target.applyDamage(this, counterDirection(), isHitBack, isPenetrate),
        ]);
    }
    async playDamage() {
        for (let i = 0; i < 2; i++) {
            await tween(this.dmBg, { opacity: 0.5 }, 80);
            await tween(this.dmBg, { opacity: 0 }, 0);
        }
        this.dmBg.opacity = 0;
    }
    async applyDamage(attacker, counterDirection, isHitBack = false, isPenetrate = false, wizardAttack = 0) {
        const { attack, hitBack, hitRate, critical } = attacker;
        const isHit = Math.random() <= hitRate;
        if (!isHit) {
            await this.iT.show("未命中");
            if (this.hitBack > 0 && !isHitBack && !wizardAttack)
                await this.execAttack(counterDirection, attacker, true, false);
            return;
        }
        this.playDamage();
        const isCritical = Math.random() <= critical;
        const damage = isHitBack
            ? hitBack
            : wizardAttack > 0
                ? wizardAttack
                : attack;
        const calculatedDamage = isCritical ? damage * 2 : damage;
        if (isCritical) {
            await this.iT.show(`暴击 -${calculatedDamage}`);
        }
        else {
            await this.iT.show(`-${calculatedDamage}`);
        }
        const remainingDamage = isPenetrate
            ? calculatedDamage
            : this.updateShield(-calculatedDamage);
        const isDead = await this.updateHealth(-remainingDamage);
        if (!isDead && this.hitBack > 0 && !isHitBack && !wizardAttack)
            await this.execAttack(counterDirection, attacker, true, false);
    }
    async applyOverweightDamage() {
        await Promise.all([this.iT.show(`超重 -1`), this.updateHealth(-1)]);
    }
    // return true if the card is dead
    async updateHealth(value) {
        this.health += value;
        if (this.health <= 0) {
            await this.setInactive();
            this.deathCallback();
            return true;
        }
        this.hT.text = `${this.health}`;
    }
    updateShield(value) {
        let remainingDamage = 0;
        this.shield += value;
        if (this.shield <= 0) {
            remainingDamage = -this.shield;
            this.shield = 0;
        }
        this.sT.text = `${this.shield}`;
        const { isD } = GameManager.gI();
        if (this.type === CardType.T && isD) {
            this.hitBack = this.shield;
            emit(EVENT.UPDATE_TEMPLAR_INFO, this);
        }
        return remainingDamage;
    }
    updateAttack(value) {
        this.attack += value;
        this.aT.text = `${this.attack}`;
    }
    refreshText() {
        this.aT.text = `${this.attack}`;
        this.hT.text = `${this.health}`;
        this.sT.text = `${this.shield}`;
        this.iT.reset();
    }
    applyBuff(buff, isDebuff = false) {
        this.updateHealth(buff.health || 0);
        this.updateShield(buff.shield || 0);
        this.updateAttack(buff.attack || 0);
        this.hitRate += buff.hitRate || 0;
        this.hitRate = Math.max(Math.min(this.hitRate, 1), 0);
        this.critical += buff.critical || 0;
        this.critical = Math.max(Math.min(this.critical, 1), 0);
        if (this.attackDirection !== AttackDirection.C || isDebuff) {
            this.attackDirection = buff.attackDirection || this.attackDirection;
        }
        this.attackType = buff.attackType || this.attackType;
        this.hitBack += buff.hitBack || 0;
        if (this.type === CardType.T) {
            emit(EVENT.UPDATE_TEMPLAR_INFO, this);
            if (!isDebuff) {
                const isBuff = checkIfBuff(buff);
                emit(EVENT.TEMPLAR_BUFF_EFFECT, isBuff);
                isBuff ? zzfx(...makeUpgradeSFX(true)) : zzfx(...negativeSFX);
            }
        }
    }
}
class ImpactText extends SpriteClass {
    set text(text) {
        this._text.text = text;
    }
    constructor(y) {
        super({
            x: 0,
            y,
            width: 100,
            height: 20,
            color: COLOR.BROWN_8,
            anchor: { x: 0.5, y: 0.5 },
            opacity: 0,
        });
        Object.defineProperty(this, "_text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._text = Text({
            text: "",
            font: `16px ${FONT}`,
            color: COLOR.WHITE_6,
            anchor: { x: 0.5, y: 0.5 },
        });
        this.addChild(this._text);
    }
    async show(text) {
        this._text.text = text;
        const origY = this.y;
        await Promise.all([
            tween(this._text, { opacity: 1 }, 500),
            tween(this, { opacity: 1 }, 500),
            tween(this, { targetY: this.y - 10 }, 500),
        ]);
        await delay(100);
        await Promise.all([
            tween(this._text, { opacity: 0 }, 300),
            tween(this, { opacity: 0 }, 300),
        ]);
        this.y = origY;
    }
    reset() {
        this.opacity = 0;
        this._text.opacity = 0;
    }
}
