// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorage = (key: string, value: any, isJson: boolean = false) => {
  if (isJson) {
      localStorage.setItem(key, JSON.stringify(value));
  } else {
      localStorage.setItem(key, value);
  }
}
export const getLocalStorage = (key: string, isJson: boolean = false) => {
  if (isJson) {
      const item = localStorage.getItem(key);
      if (item === null) {
          return null;
      }
      return JSON.parse(item);
  } else {
      return localStorage.getItem(key);
  }
}
export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
}