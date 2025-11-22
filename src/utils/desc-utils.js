export const getEnemyPropsDescText = (buff) => getCharacterPropsDescText(buff, false);
export const getItemPropsDescText = (buff) => getCharacterPropsDescText(buff, true);
const getCharacterPropsDescText = (buff, isAccurate) => {
    const buffTexts = Object.entries(buff).map(([key, value]) => {
        if (!value)
            return "";
        if (key === "attackDirection")
            return `范围：${value}`;
        if (key === "attackType")
            return `${value}`;
        const percentageKeys = ["hitRate", "critical"];
        const keyMap = {
            "health": "生命值",
            "shield": "护盾",
            "attack": "攻击力",
            "hitRate": "命中率",
            "critical": "暴击率",
            "hitBack": "击退"
        };
        const displayKey = keyMap[key] || key;
        if (value > 0) {
            if (!isAccurate)
                return `高${displayKey}`;
            if (percentageKeys.includes(key)) {
                return `${displayKey} +${(value * 100).toFixed()}%`;
            }
            return `${displayKey} +${value}`;
        }
        else {
            if (!isAccurate)
                return `低${displayKey}`;
            if (percentageKeys.includes(key)) {
                return `${displayKey} ${(value * 100).toFixed()}%`;
            }
            return `${displayKey} ${value}`;
        }
    });
    return buffTexts.join("\n");
};
