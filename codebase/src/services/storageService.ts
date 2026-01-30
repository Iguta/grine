const STORAGE_KEY = 'grine-data'

export interface StoredData<T> {
  version: number
  payload: T
}

export const loadFromStorage = <T>(fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return fallback
    }
    const parsed = JSON.parse(raw) as StoredData<T>
    if (!parsed || typeof parsed !== 'object' || !('payload' in parsed)) {
      return fallback
    }
    return parsed.payload
  } catch (error) {
    console.warn('Failed to load storage data', error)
    return fallback
  }
}

export const saveToStorage = <T>(payload: T) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const data: StoredData<T> = { version: 1, payload }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save storage data', error)
  }
}
