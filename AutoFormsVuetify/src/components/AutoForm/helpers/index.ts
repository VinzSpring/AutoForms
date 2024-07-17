
export const appendPath = (path: string, field: string): string => {
  return `${path}.${field}`;
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

export function updateObjectAtPath(obj: any, path: string, value: any) {
  const keys = path.split('.');

  let current = obj;
  for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      
      // If it's the last key, set the value
      if (i === keys.length - 1) {
          current[key] = value;
      } else {
          // Determine if the next key is an array index
          const nextKey = keys[i + 1];
          const isArrayIndex = !isNaN(parseInt(nextKey));
          
          // If the key doesn't exist, create an object or array
          if (!(key in current)) {
              current[key] = isArrayIndex ? [] : {};
          }
          
          // Move to the next level
          current = current[key];
      }
  }
}