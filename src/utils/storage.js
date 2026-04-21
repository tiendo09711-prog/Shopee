export function getStorageValue(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

export function setStorageValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageValue(key) {
  localStorage.removeItem(key)
}
