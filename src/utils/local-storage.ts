export const setToLocalStorage = (key: string, value: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
};
