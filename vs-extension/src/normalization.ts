export function sigmoidFunction(x: number): number {
    return 100 / (1 + Math.exp(-x));
}