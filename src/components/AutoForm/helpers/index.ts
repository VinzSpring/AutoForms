
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

export function deleteObjectAtPath(obj: any, path: string) {
  console.info('deleteObjectAtPath', obj, path);
  const keys = path.split('.');

  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // If the current key doesn't exist, nothing to delete
      if (!(key in current)) {
          return;
      }
      current = current[key];
  }

  const finalKey = keys[keys.length - 1];
  if (Array.isArray(current)) {
      const index = parseInt(finalKey);
      if (index >= 0 && index < current.length) {
          current.splice(index, 1);
      }
  } else {
    const el = current[finalKey];
    if (el) {
      if (Array.isArray(el)) {
        current[finalKey] = [];
      } else {
        delete current[finalKey];
      }
    }
  }
}