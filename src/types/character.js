export var AttackDirection;
(function (AttackDirection) {
    AttackDirection["F"] = "\u524D\u65B9";
    AttackDirection["A"] = "\u5468\u56F4";
    AttackDirection["C"] = "\u5341\u5B57";
})(AttackDirection || (AttackDirection = {}));
export const DIRECTION_TIER_MAP = {
    [AttackDirection.F]: 2,
    [AttackDirection.A]: 1,
    [AttackDirection.C]: 0,
};
export var AttackType;
(function (AttackType) {
    AttackType["N"] = "\u666E\u901A";
    AttackType["P"] = "\u7A7F\u900F";
})(AttackType || (AttackType = {}));
