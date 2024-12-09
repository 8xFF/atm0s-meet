import localforage from 'localforage'

const cacheStore = localforage.createInstance({
  name: 'app-meet-8xff',
})

// 60 ngày (60 * 24 * 60 * 60 * 1000 ms)
const DEFAULT_TTL = 60 * 24 * 60 * 60 * 1000

export const getIndexedDBCache = async (key: string) => {
  const cachedData = await cacheStore.getItem<{ data: any; expiration: number }>(key)
  if (cachedData) {
    const { data, expiration } = cachedData
    if (Date.now() < expiration) {
      return data
    }
    // Xóa cache nếu hết hạn
    await cacheStore.removeItem(key)
  }
  return null
}

export const setIndexedDBCache = async (key: string, data: any, ttl: number = DEFAULT_TTL) => {
  const expiration = Date.now() + ttl
  await cacheStore.setItem(key, { data, expiration })
}
