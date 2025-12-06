// Array utility functions

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []
  );
}

export function groupBy<T, K extends keyof any>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  return arr.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}
