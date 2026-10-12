type WithId = { id?: string };

export function addUnique<T extends WithId>(list: T[], item: T): T[] {
  return list.some((entry) => entry.id === item.id) ? list : [...list, item];
}

export function removeAt<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

export function toIds(list: WithId[]): string[] {
  return list.flatMap((entry) => (entry.id ? [entry.id] : []));
}
