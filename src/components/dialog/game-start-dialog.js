import { getCanvas } from "kontra";
import { CustomButton, OverlayDialog } from "./shared-ui";
import { GameManager, GameState, TemplarClass, } from "../../managers/game-manager";
import { LOCAL_STORAGE_KEY } from "../../constants/localstorage";
export class GameStartDialog extends OverlayDialog {
    constructor() {
        super(360, 180);
        Object.defineProperty(this, "wBtn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "kBtn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dBtn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const isPlayed = localStorage.getItem(LOCAL_STORAGE_KEY.PLAYED) === "t";
        this.tT.text = "选择职业";
        this.dT.text = isPlayed
            ? "是时候探索新职业了！"
            : "骑士是您目前唯一的选项";
        const { width: w, height: h } = getCanvas();
        this.wBtn = new CustomButton(w / 2 - 108, h / 2 + 52, TemplarClass.W, !isPlayed);
        this.kBtn = new CustomButton(w / 2, h / 2 + 52, TemplarClass.K);
        this.dBtn = new CustomButton(w / 2 + 108, h / 2 + 52, TemplarClass.D, !isPlayed);
        this.wBtn.bindClick(() => {
            this.onButtonClick(TemplarClass.W);
        });
        this.kBtn.bindClick(() => {
            this.onButtonClick(TemplarClass.K);
        });
        this.dBtn.bindClick(() => {
            this.onButtonClick(TemplarClass.D);
        });
        this.addChild([this.wBtn, this.kBtn, this.dBtn]);
    }
    onButtonClick(cls) {
        const gm = GameManager.gI();
        if (gm.state !== GameState.INIT)
            return;
        gm.setClass(cls);
        this.wBtn.offClick();
        this.kBtn.offClick();
        this.dBtn.offClick();
    }
    render() {
        const gm = GameManager.gI();
        if (gm.state !== GameState.INIT)
            return;
        super.render();
    }
}
