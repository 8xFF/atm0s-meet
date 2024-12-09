'use client'

import { AudioMixerPlayer, PeerLocal, PeerRemote } from '@/components'
import { Button } from '@/components/ui/button'
import { BottomBarV2 } from '@/containers/room/components/bottom-bar-v2'
import { Header } from '@/layouts/header'
import { RoomStore } from '@/stores/room'
import { useRemotePeers, useRoom } from '@atm0s-media-sdk/react-hooks'
import { useUser } from '@clerk/nextjs'
import { useMouse } from '@uidotdev/usehooks'
import { useSetAtom } from 'jotai'
import { filter, map } from 'lodash'
import { CopyIcon, XIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'
import { GridViewLayout } from './components'

type Props = {
  host: string | null
}

export const Meeting: React.FC<Props> = ({ host }) => {
  const params = useParams()
  const room = useRoom()
  const remotePeers = useRemotePeers()
  // const streamVideoScreen = useDeviceStream('video_screen')
  const meetingLink = `https://${host}/invite/${params?.room}`
  const [, onCopy] = useCopyToClipboard()
  const [isCreateNewRoom, setIsCreateNewRoom] = useState(true)
  const [mouse, containerRef] = useMouse<any>()
  const { user } = useUser()
  const addListUserToRoom = useSetAtom(RoomStore.addListUserToRoom)

  const widthContent = containerRef?.current?.clientWidth
  const heightContent = containerRef?.current?.clientHeight

  const xOffsetMouse = mouse.elementX > 0 && mouse.elementX <= widthContent
  const yOffsetMouse = mouse.elementY > 0 && mouse.elementY <= heightContent
  const isHoverContent = xOffsetMouse && yOffsetMouse

  const onCopyInviteLink = () => {
    onCopy(meetingLink as string).then(() => {
      toast.success('Copied invite link', { duration: 2000 })
    })
  }

  // const [videoScreen, setVideoScreen] = useState<any>()
  const peerLocal = useMemo(() => <PeerLocal />, [])
  //
  // const peerScreenShare = useMemo(() => {
  //   if (!videoScreen) return peerLocal
  //   const findScreenShare: any = find(remotePeers, (p: any) => p.peer === videoScreen?.peer)
  //   return <PeerRemote peer={findScreenShare} />
  // }, [peerLocal, remotePeers, videoScreen])

  const peerRemoteMixerAudio = useMemo(() => {
    const filterRemotePeers = filter(remotePeers, (p) => p.peer != room?.peer)
    const mapRemotePeers = map(filterRemotePeers, (p) => <PeerRemote key={p.peer} peer={p} />)

    // if (videoScreen) return [peerLocal, ...mapRemotePeers]

    return mapRemotePeers
  }, [remotePeers, room?.peer])

  useEffect(() => {
    addListUserToRoom({
      users: [
        {
          gmail: user?.emailAddresses?.[0]?.emailAddress as string,
          name: user?.fullName ?? '',
          avatar: user?.imageUrl as string,
        },
        ...map(remotePeers, (item) => ({ gmail: item.peer, name: item.peer, avatar: '' })),
      ],
      roomCode: (params?.room ?? '') as string,
    })

    return () => {
      addListUserToRoom({
        users: [],
        roomCode: (params?.room ?? '') as string,
      })
    }
  }, [addListUserToRoom, params?.room, remotePeers, user])

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-start justify-center overflow-hidden bg-foreground px-4 py-16"
    >
      {isHoverContent && <Header meetingLink={meetingLink} />}
      <div className="flex h-full w-full flex-col">
        <GridViewLayout items={[peerLocal, ...(peerRemoteMixerAudio || [])]} renderItem={(i) => i} />

        {/*{streamVideoScreen || videoScreen ? (*/}
        {/*  <SidebarViewLayout items={[peerScreenShare, ...(peerRemoteMixerAudio || [])]} renderItem={(i) => i} />*/}
        {/*) : (*/}
        {/*  <GridViewLayout items={[peerLocal, ...(peerRemoteMixerAudio || [])]} renderItem={(i) => i} />*/}
        {/*)}*/}
        <AudioMixerPlayer />
        {/*<BottomBar meetingLink={meetingLink} />*/}
      </div>
      {isHoverContent && <BottomBarV2 />}

      {isCreateNewRoom && (
        <div className="absolute bottom-24 left-8 w-[360px] rounded-xl bg-muted">
          <div className="flex items-center justify-between py-2 pl-4 pr-3">
            <div>Your meeting&apos;s ready</div>
            <Button className={'h-7 w-7'} variant={'ghost'} onClick={() => setIsCreateNewRoom(false)}>
              <XIcon size={16} />
            </Button>
          </div>
          <div className="grid gap-4 px-4 pb-4">
            <div className="text-xs text-muted-foreground">Share this meeting link with others you want in the meeting</div>
            <div className="flex h-10 items-center gap-2 rounded bg-zinc-200 pl-3">
              <div className="flex-1 text-sm">{meetingLink}</div>
              <Button variant="link" size="icon" onClick={onCopyInviteLink}>
                <CopyIcon size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
