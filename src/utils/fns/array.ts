export function intersectArray(
  a: string[],
  b: string[],
): { onlyInA: string[]; onlyInB: string[]; inBoth: string[] } {
  const onlyInA = a.filter((x) => !b.includes(x));
  const onlyInB = b.filter((x) => !a.includes(x));
  const inBoth = a.filter((x) => b.includes(x));
  return { onlyInA, onlyInB, inBoth };
}
