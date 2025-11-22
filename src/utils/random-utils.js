export function getRandomPropertyKeys(obj, count = 1) {
    const keys = Object.keys(obj);
    const shuffled = [...keys].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, keys.length));
}
export function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}
export function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
