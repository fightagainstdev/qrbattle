import {
  emit,
  GameObjectClass,
  getCanvas,
  on,
  SpriteClass,
  Text,
} from "kontra";
import { COLOR } from "../../constants/color";
import { COMMON_TEXT_CONFIG, FONT } from "../../constants/text";
import { detectCanvasClick } from "./shared-ui";
import { drawPolygon } from "../../utils/draw-utils";
import { tween } from "../../utils/tween-utils";
import {
  GameManager,
  GameState,
  TemplarClass,
} from "../../managers/game-manager";
import { EVENT } from "../../constants/event";

export class IntroDialog extends SpriteClass {
  private currI: number = 0;
  private clickCallback: ((event: PointerEvent) => void) | null = null;
  private content: Text;
  private paragraphs = [
    "向上、向下、向左或向右移动。\n我可以向敌人或物品移动\n来攻击或装备。",
    "相同物品会组合成更强的物品\n——除了药水。\n可能会变成增益或减益。",
    "除了药水，一切都会增加重量，\n如果达到13，\n我的十三恐惧症会让每一步都疼痛\n直到物品持续时间结束。",
  ];

  constructor(x: number, y: number) {
    super({
      x,
      y,
      width: 500,
      height: 200,
      color: COLOR.DARK_6,
      anchor: { x: 0.5, y: 0.5 },
    });

    this.content = Text({
      text: this.paragraphs[this.currI],
      ...COMMON_TEXT_CONFIG,
      font: `18px ${FONT}`,
      textAlign: "center",
      lineHeight: 1.5,
    });
    this.addChild([this.content, new Triangle(224, 76)]);

    const canvas = getCanvas();
    this.clickCallback = this.onClick.bind(this);
    canvas.addEventListener("pointerdown", this.clickCallback);
    on(EVENT.UPDATE_TEMPLAR_CLASS, this.onCls.bind(this));
  }

  onCls(cls: TemplarClass) {
    const map = {
      [TemplarClass.K]: `我没什么特别的\n——只是平衡且准备战斗！`,
      [TemplarClass.W]: "我很弱\n但可以用药水攻击所有敌人！",
      [TemplarClass.D]: "我被击中\n并更猛烈地反击！",
    };
    this.paragraphs.push(`作为${cls}\n` + map[cls]);
  }

  onClick(event: PointerEvent) {
    const gm = GameManager.gI();
    if (gm.state !== GameState.INTRO) return;
    const canvas = getCanvas();
    const isClicked = detectCanvasClick(event, this);
    if (isClicked) {
      if (this.currI === this.paragraphs.length - 1) {
        if (this.clickCallback) {
          canvas.removeEventListener("pointerdown", this.clickCallback);
          gm.state = GameState.IDLE;
          emit(EVENT.GAME_START);
        }
      } else {
        this.currI++;
        this.content.text = this.paragraphs[this.currI];
      }
    }
  }

  render(): void {
    const gm = GameManager.gI();
    if (gm.state !== GameState.INTRO) return;
    super.render();
  }
}

class Triangle extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
    this.play();
  }
  async play() {
    while (true) {
      await tween(this, { targetY: this.y - 5 }, 800);
      await tween(this, { targetY: this.y + 5 }, 800);
    }
  }
  draw(): void {
    drawPolygon(this.context, "6.3 11 12.6 0 0 0 6.3 11", COLOR.WHITE_6);
  }
}
