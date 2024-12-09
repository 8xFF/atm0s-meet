'use client'

import { AudioMixerPlayer, PeerLocal, PeerRemote } from '@/components'
import { Button } from '@/components/ui/button'
import { peerPinnedAtom } from '@/jotai/peer'
import { useRemotePeers, useRoom } from '@atm0s-media-sdk/react-hooks'
import { useMouse } from '@uidotdev/usehooks'
import { useAtomValue } from 'jotai'
import { filter, find, map } from 'lodash'
import { CopyIcon, XIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'
import { BottomBarV2, GridViewLayout, Header, SidebarViewLayout } from './components'

type Props = {
  host: string | null
}

export const Meeting: React.FC<Props> = ({ host }) => {
  const params = useParams()
  const room = useRoom()
  const remotePeers = useRemotePeers()
  const meetingLink = `https://${host}/invite/${params?.room}`
  const [, onCopy] = useCopyToClipboard()
  const [isCreateNewRoom, setIsCreateNewRoom] = useState(true)
  const [mouse, containerRef] = useMouse<any>()
  const widthContent = containerRef?.current?.clientWidth
  const heightContent = containerRef?.current?.clientHeight
  const peerPinned = useAtomValue(peerPinnedAtom)

  const checkPeerPinned = useMemo(() => {
    if (peerPinned?.peer === room?.peer) return { check: true, peer: 'local', peerItem: room }
    const findRemotePeer = find(remotePeers, (peer) => peer.peer === peerPinned?.peer)
    return findRemotePeer
      ? { check: true, peer: 'remote', peerItem: findRemotePeer }
      : { check: false, peer: null, peerItem: null }
  }, [peerPinned?.peer, room, remotePeers])

  const isHoverContent =
    mouse.elementX > 0 && mouse.elementX <= widthContent && mouse.elementY > 0 && mouse.elementY <= heightContent

  const onCopyInviteLink = () => {
    onCopy(meetingLink as string).then(() => {
      toast.success('Copied invite link', { duration: 2000 })
    })
  }

  const peerLocal = useMemo(() => <PeerLocal />, [])

  const mainPeerScreen = useMemo(() => {
    if (checkPeerPinned.check && checkPeerPinned.peer === 'remote') {
      const peer: any = checkPeerPinned.peerItem
      return <PeerRemote peer={peer} />
    }
    return peerLocal
  }, [checkPeerPinned, peerLocal])

  const filterRemotePeers = useMemo(() => filter(remotePeers, (p) => p.peer != room?.peer), [remotePeers, room?.peer])

  const peerRemoteMixerAudio = useMemo(() => {
    let mapRemotePeers = []
    if (checkPeerPinned.check && checkPeerPinned.peer === 'remote') {
      const peerRemote: any = filter(filterRemotePeers, (p) => p.peer != checkPeerPinned?.peerItem?.peer)
      const peerRemoteScreen = map(peerRemote, (p) => <PeerRemote key={p.peer} peer={p} />)
      mapRemotePeers = [peerLocal, ...peerRemoteScreen]
    } else {
      mapRemotePeers = map(filterRemotePeers, (p) => <PeerRemote key={p.peer} peer={p} />)
    }
    return mapRemotePeers
  }, [checkPeerPinned.check, checkPeerPinned.peer, checkPeerPinned?.peerItem?.peer, filterRemotePeers, peerLocal])

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-start justify-center overflow-hidden bg-foreground px-4 pt-[60px]"
    >
      {isHoverContent && <Header meetingLink={meetingLink} />}

      <div className="flex h-full max-h-[calc(100vh-168px)] w-full flex-col">
        {!checkPeerPinned?.check ? (
          <GridViewLayout items={[mainPeerScreen, ...(peerRemoteMixerAudio || [])]} />
        ) : (
          <SidebarViewLayout
            showButtonExpand={isHoverContent}
            mainPeerScreen={mainPeerScreen}
            remotePeerScreens={[...(peerRemoteMixerAudio || [])]}
          />
        )}
        <AudioMixerPlayer />
      </div>
      {isHoverContent && <BottomBarV2 />}

      {isCreateNewRoom && (
        <div className="absolute bottom-24 left-8 z-[2] w-[360px] rounded-xl bg-muted">
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
