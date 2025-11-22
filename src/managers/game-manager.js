import { emit, on } from "kontra";
import { EVENT } from "../constants/event";
import { Direction } from "../types/direction";
import { zzfx, zzfxM, zzfxP } from "../audios/zzfx";
import { bgm } from "../audios/bgm";
import { SwipeDetector } from "../utils/swipe-detector";
import { negativeSFX, swipeSFX } from "../audios/sfx";
export var GameState;
(function (GameState) {
    GameState[GameState["PROLOGUE"] = 0] = "PROLOGUE";
    GameState[GameState["INIT"] = 1] = "INIT";
    GameState[GameState["INTRO"] = 2] = "INTRO";
    GameState[GameState["IDLE"] = 3] = "IDLE";
    GameState[GameState["SWIPING"] = 4] = "SWIPING";
    GameState[GameState["GAME_OVER"] = 5] = "GAME_OVER";
})(GameState || (GameState = {}));
export var TemplarClass;
(function (TemplarClass) {
    TemplarClass["K"] = "\u9A91\u58EB";
    TemplarClass["W"] = "\u6CD5\u5E08";
    TemplarClass["D"] = "\u9632\u5FA1\u8005";
})(TemplarClass || (TemplarClass = {}));
export class GameManager {
    get level() {
        return Math.floor(this.move / 5);
    }
    get isElite() {
        return ((this.move > 0 && this.move % 13 === 0) ||
            (this.move >= 78 && this.move % 5 === 0));
    }
    get isW() {
        return this.cls === TemplarClass.W;
    }
    get isK() {
        return this.cls === TemplarClass.K;
    }
    get isD() {
        return this.cls === TemplarClass.D;
    }
    constructor() {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: GameState.PROLOGUE
        });
        Object.defineProperty(this, "move", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "music", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "currentItems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "cls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "speed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        }); // 1x speed
        new SwipeDetector({
            onSwipeLeft: this.swipe.bind(this, Direction.L),
            onSwipeRight: this.swipe.bind(this, Direction.R),
            onSwipeUp: this.swipe.bind(this, Direction.U),
            onSwipeDown: this.swipe.bind(this, Direction.D),
        });
        window.addEventListener("keydown", (e) => {
            if (["ArrowLeft", "a"].includes(e.key))
                this.swipe(Direction.L);
            if (["ArrowRight", "d"].includes(e.key))
                this.swipe(Direction.R);
            if (["ArrowUp", "w"].includes(e.key))
                this.swipe(Direction.U);
            if (["ArrowDown", "s"].includes(e.key))
                this.swipe(Direction.D);
        });
        on(EVENT.SWIPE_FINISH, () => {
            if (this.state === GameState.GAME_OVER)
                return;
            this.state = GameState.IDLE;
        });
    }
    static gI() {
        // get instance
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }
    setClass(cls) {
        this.cls = cls;
        emit(EVENT.UPDATE_TEMPLAR_CLASS, cls);
        this.state = GameState.INTRO;
    }
    toggleBGM() {
        if (this.music) {
            this.music.stop();
            this.music = null;
        }
        else {
            // @ts-ignore
            this.music = zzfxP(...zzfxM(...bgm));
            this.music.loop = true;
        }
    }
    toggleSpeed() {
        this.speed = this.speed === 1 ? 1.5 : this.speed === 1.5 ? 2 : 1;
    }
    swipe(direction) {
        if (this.state !== GameState.IDLE)
            return;
        this.move++;
        this.state = GameState.SWIPING;
        zzfx(...swipeSFX);
        emit(EVENT.SWIPE, direction);
    }
    addItems(itemCards) {
        itemCards.forEach((item) => {
            if (this.isD)
                item.duration = Math.min(5, item.duration); // defender can only have 5 duration
            this.currentItems.push(item);
        });
        emit(EVENT.ITEMS_UPDATED, itemCards, []);
    }
    removeItems(itemCards) {
        // remove from current items
        const newCurrentItem = this.currentItems.filter((item) => !itemCards.includes(item));
        this.currentItems = newCurrentItem;
        emit(EVENT.ITEMS_UPDATED, [], itemCards);
    }
    gameOver() {
        if (this.state === GameState.GAME_OVER)
            return;
        this.state = GameState.GAME_OVER;
        this.music?.stop();
        zzfx(...negativeSFX);
        emit(EVENT.GAME_OVER);
    }
}
