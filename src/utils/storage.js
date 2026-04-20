export function getStorageValue(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallbackValue
  } catch (error) {
    return fallbackValue
  }
}

export function setStorageValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageValue(key) {
  localStorage.removeItem(key)
}
