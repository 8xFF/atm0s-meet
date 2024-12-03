import type { TRoom } from '@/types'
import { getIndexedDBCache, setIndexedDBCache } from './cache-store'

class RoomManager {
  private static readonly STORAGE_KEY = '8xff.room'

  static async createRoom(code: string, name: string) {
    const rooms = (await getIndexedDBCache(this.STORAGE_KEY)) || []

    const roomExists = rooms.some((room: { code: string }) => room.code === code)

    if (!roomExists) {
      rooms.push({ code, name, users: [] })
      await setIndexedDBCache(this.STORAGE_KEY, rooms)
      return { success: true, message: `Room "${name}" created.` }
    }

    return { success: false, message: `Room with code "${code}" already exists.` }
  }

  static async deleteRoom(code: string) {
    const rooms = (await getIndexedDBCache(this.STORAGE_KEY)) || []

    const updatedRooms = rooms.filter((room: { code: string }) => room.code !== code)

    if (updatedRooms.length === rooms.length) {
      return { success: false, message: `Room with code "${code}" does not exist.` }
    }

    await setIndexedDBCache(this.STORAGE_KEY, updatedRooms)
    return { success: true, message: `Room with code "${code}" deleted.` }
  }

  static async addUserToRoom(code: string, user: { gmail: string; name: string; avatar: string }) {
    const rooms = (await getIndexedDBCache(this.STORAGE_KEY)) || []

    const room = rooms.find((room: { code: string }) => room.code === code)

    if (!room) {
      return { success: false, message: `Room with code "${code}" does not exist.` }
    }

    const userExists = room.users.some((u: { gmail: string }) => u.gmail === user.gmail)
    if (userExists) {
      return { success: false, message: `User "${user.gmail}" is already in room "${code}".` }
    }

    room.users.push(user)

    await setIndexedDBCache(this.STORAGE_KEY, rooms)
    return { success: true, message: `User "${user.gmail}" added to room "${code}".` }
  }

  static async removeUserFromRoom(code: string, gmail: string) {
    const rooms = (await getIndexedDBCache(this.STORAGE_KEY)) || []

    const room = rooms.find((room: { code: string }) => room.code === code)

    if (!room) {
      return { success: false, message: `Room with code "${code}" does not exist.` }
    }

    const userIndex = room.users.findIndex((u: { gmail: string }) => u.gmail === gmail)
    if (userIndex === -1) {
      return { success: false, message: `User with gmail "${gmail}" is not in room "${code}".` }
    }

    room.users.splice(userIndex, 1)

    await setIndexedDBCache(this.STORAGE_KEY, rooms)
    return { success: true, message: `User with gmail "${gmail}" removed from room "${code}".` }
  }

  static async getAllRooms() {
    const rooms: TRoom[] = (await getIndexedDBCache(this.STORAGE_KEY)) || []
    return { success: true, rooms }
  }

  static async getRoomByCode(code: string) {
    const rooms = (await getIndexedDBCache(this.STORAGE_KEY)) || []

    const room: TRoom = rooms.find((room: { code: string }) => room.code === code)

    if (!room) {
      return { success: false, message: `Room with code "${code}" does not exist.` }
    }

    return { success: true, room }
  }
}

export default RoomManager
