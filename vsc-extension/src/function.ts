export function f(x: number): number {
    let y = Math.min(x, 150);
    y = Math.max(0, y);
    y = Math.floor(y);
    return y;
}