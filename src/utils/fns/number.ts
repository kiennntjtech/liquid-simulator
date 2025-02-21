export function plus(...args: (string | number)[]): number {
  let result = 0;
  while (args.length) {
    const arg = args.shift();
    const a = +arg;
    if (!isNaN(a)) {
      result += a;
    }
  }
  return result;
}

export function toNumber(value: string | number): number {
  return !isNaN(+value) ? +value : 0;
}

export function decimalDisplay(value: number, decimal: number = 2): number {
  return +value.toFixed(decimal);
}
