import { TRoom } from '@/types'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const roomAtom = atomWithStorage<TRoom[]>('8xff.room', [])

const createRoomUseLater = atom(null, (get, set, update: TRoom) => {
  const rooms = get(roomAtom)
  if (rooms) {
    const roomExists = rooms.some((room: { code: string }) => room?.code === update?.code)

    if (!roomExists) {
      set(roomAtom, (prev) => [...prev, { code: update?.code, name: update?.name, users: [] }])
    } else {
      console.warn(`Room with code already exists.`)
    }
  }
})

const removeRoomUseLater = atom(null, (get, set, update: TRoom) => {
  const rooms = get(roomAtom)
  if (rooms) {
    const updatedRooms = rooms.filter((room: { code: string }) => room.code !== update.code)

    if (updatedRooms.length !== rooms.length) {
      set(roomAtom, updatedRooms)
    }
  }
})

const addUserToRoom = atom(null, (get, set, update: { gmail: string; name: string; avatar: string; roomCode: string }) => {
  const rooms = get(roomAtom)
  if (rooms) {
    const room = rooms.find((room: { code: string }) => room.code === update.roomCode)
    const userExists = room?.users.some((u: { gmail: string }) => u.gmail === update.gmail)
    if (!userExists && room) {
      room.users.push({
        gmail: update.gmail,
        name: update.name,
        avatar: update.avatar,
      })

      set(roomAtom, rooms)
    }
  }
})

const addListUserToRoom = atom(
  null,
  (get, set, update: { users: { gmail: string; name: string; avatar: string }[]; roomCode: string }) => {
    const rooms = get(roomAtom)
    if (rooms) {
      const room = rooms.find((room: { code: string }) => room.code === update.roomCode)
      if (room) {
        room.users = update.users
        set(roomAtom, rooms)
      }
    }
  }
)

export const RoomStore = {
  data: roomAtom,
  createRoomUseLater,
  removeRoomUseLater,
  addUserToRoom,
  addListUserToRoom,
}
