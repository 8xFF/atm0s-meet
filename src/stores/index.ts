import { atom } from 'recoil'

export const isCreateNewRoomState = atom({
  key: 'isCreateNewRoomState',
  default: false,
})

export const isScreenShareState = atom({
  key: 'isScreenShareState',
  default: false,
})
