
export const appendPath = (path: string, field: string): string => {
  return `${path}/${field}`;
};

export const isChoice = (type: string): boolean => {
  return type.includes('|');
};

export const parseChoice = (type: string): string[] => {
  if (!isChoice(type)) {
    return [];
  }
  return type.split('|').map(s => s.trim());
}