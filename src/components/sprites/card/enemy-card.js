import { Belongs, CardType } from "./type";
import { CharacterCard } from "./character-card";
import { AttackDirection, AttackType, } from "../../../types/character";
import { EVENT } from "../../../constants/event";
import { emit, Sprite, Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { GameManager } from "../../../managers/game-manager";
import { randomPick } from "../../../utils/random-utils";
import { getEnemyPropsDescText } from "../../../utils/desc-utils";
import { Direction } from "../../../types/direction";
import { COLOR } from "../../../constants/color";
import { Enemy } from "../enemy";
export class EnemyCard extends CharacterCard {
    constructor({ x, y }) {
        super({
            type: CardType.E,
            x,
            y,
            belongs: Belongs.ENEMY,
        });
        Object.defineProperty(this, "dT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dT = Text({
            x: 0,
            y: 18,
            text: "",
            ...COMMON_TEXT_CONFIG,
            textAlign: "center",
        });
        this.main.addChild(this.dT);
        this.resetProps();
    }
    async onWizardAttack(wizard, level) {
        const gm = GameManager.gI();
        const factor = gm.level;
        await this.applyDamage(wizard, Direction.U, false, wizard.attackType === AttackType.P, Math.floor(level * factor * 0.8));
    }
    getMainIcon() {
        return Sprite();
    }
    deathCallback() {
        emit(EVENT.ENEMY_DEAD, this);
    }
    resetProps() {
        const gm = GameManager.gI();
        const level = gm.level;
        this.health = 5 + 2 * level;
        this.attack = 2 + 1 * level;
        this.shield = 0;
        this.hitRate = 0.8;
        this.attackDirection = AttackDirection.F;
        this.attackType = AttackType.N;
        this.hitBack = 0;
        if (gm.isElite)
            this.circle.color = COLOR.BROWN_8;
        this.critical = gm.isElite ? 0 : 0.1; // Prevent elite enemy from critical (overpower)
        // Add extra buff
        const { buff, desc, character } = randomPick(getEnemyBuffsAndDesc(level + 1, gm.isElite));
        this.applyBuff(buff);
        this.dT.text = desc;
        this.refreshText();
        this.dmBg.opacity = 0;
        // reset icon
        const mainIcon = new Enemy(-23, -36, character);
        this.main.children[1] = mainIcon; // FIXME: This is a hacky way to replace the icon
    }
}
export var EnemyCharacter;
(function (EnemyCharacter) {
    EnemyCharacter[EnemyCharacter["W"] = 0] = "W";
    EnemyCharacter[EnemyCharacter["G"] = 1] = "G";
    EnemyCharacter[EnemyCharacter["CS"] = 2] = "CS";
    EnemyCharacter[EnemyCharacter["S"] = 3] = "S";
    EnemyCharacter[EnemyCharacter["CB"] = 4] = "CB";
    EnemyCharacter[EnemyCharacter["L"] = 5] = "L";
})(EnemyCharacter || (EnemyCharacter = {}));
let eliteCount = -1;
const getEnemyBuffsAndDesc = (factor, isElite) => {
    if (isElite) {
        const elites = [
            {
                buff: {
                    attackDirection: AttackDirection.A,
                    health: 2 * factor,
                    attack: 1 * factor,
                },
                desc: `"旋风斩击者"\n范围: 周围`,
                character: EnemyCharacter.W,
            },
            {
                buff: {
                    shield: 4 * factor,
                },
                desc: `"守护者"\n护盾: ${4 * factor}`,
                character: EnemyCharacter.G,
            },
            {
                buff: {
                    hitBack: 2 * factor,
                    health: 2 * factor,
                },
                desc: `"反击者"\n击退: ${2 * factor}`,
                character: EnemyCharacter.CS,
            },
            {
                buff: {
                    attackType: AttackType.P,
                    attack: 2 * factor,
                },
                desc: `"长矛兵"\n穿透护盾`,
                character: EnemyCharacter.S,
            },
            {
                buff: {
                    attackDirection: AttackDirection.C,
                    health: 1 * factor,
                },
                desc: `"十字剑士"\n范围: 十字`,
                character: EnemyCharacter.CB,
            },
            {
                buff: {
                    attackDirection: AttackDirection.A,
                    attackType: AttackType.P,
                    shield: 5 * factor,
                },
                desc: `"长枪穿透者"\n穿透, 周围`,
                character: EnemyCharacter.L,
            },
        ];
        eliteCount < elites.length - 1 ? eliteCount++ : (eliteCount = 0);
        return [elites[eliteCount]];
    }
    else {
        const buffs = [
            { shield: 2 * factor, health: -2 * factor },
            { health: 1 * factor, attack: Math.floor(-0.5 * factor) },
            { critical: 0.05 * factor, health: -2 * factor },
            { attack: 1 * factor, hitRate: -0.2 },
        ];
        return buffs.map((buff) => ({
            buff,
            desc: getEnemyPropsDescText(buff),
            character: null,
        }));
    }
};
