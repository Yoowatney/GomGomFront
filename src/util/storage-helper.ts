const setLocalStorage = (key: string, value: string): void =>
  localStorage.setItem(key, value);

const getLocalStorage = (key: string): string | null =>
  localStorage.getItem(key);

export { getLocalStorage, setLocalStorage };
