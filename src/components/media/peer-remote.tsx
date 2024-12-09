import { VideoRemote } from '@/components'
import { Button } from '@/components/ui/button'
import { useAudioMixerSpeaking } from '@/hooks'
import { peerPinnedAtom } from '@/jotai/peer'
import { cn } from '@/lib'
import { RemotePeer, RemoteTrack, useRemoteVideoTracks } from '@atm0s-media-sdk/react-hooks'
import { useAtom } from 'jotai'
import { find, isEmpty } from 'lodash'
import { Pin, PinOff } from 'lucide-react'

type Props = {
  peer: RemotePeer
}

export const PeerRemote: React.FC<Props> = ({ peer }) => {
  const remote_videos = useRemoteVideoTracks(peer.peer)
  const { speaking } = useAudioMixerSpeaking(peer.peer)
  const video_main = find(remote_videos, (t) => t.track === 'video_main')
  const video_screen = find(remote_videos, (t) => t.track === 'video_screen')
  const [peerPinned, setPeerPinned] = useAtom(peerPinnedAtom)
  const isPinned = peerPinned?.peer === peer?.peer
  const onPin = () => {
    setPeerPinned(isPinned ? null : peer)
  }

  return (
    <div
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-800', {
        'ring-4 ring-green-500 ring-opacity-70': speaking,
      })}
    >
      <Button
        onClick={onPin}
        variant={!isPinned ? 'outline' : 'blue'}
        size="icon"
        className={'absolute right-2 top-2 z-[2] h-7 w-7 text-foreground'}
      >
        {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
      </Button>

      <div className="absolute bottom-3 left-2 z-[1] flex items-center gap-1">
        <div className="truncate rounded-full bg-slate-950 bg-opacity-30 px-2 py-0.5 text-sm text-white">{peer.peer}</div>
      </div>
      {!isEmpty(remote_videos) ? (
        <>
          {video_screen ? (
            <VideoRemote key={video_screen?.track} track={video_screen as RemoteTrack} mirror={false} />
          ) : (
            <VideoRemote key={video_main?.track} track={video_main as RemoteTrack} />
          )}
        </>
      ) : (
        <div className="flex aspect-square max-h-40 w-1/3 max-w-40 items-center justify-center rounded-full bg-zinc-500 text-[calc(200%)] uppercase text-white">
          {peer.peer?.[0]}
        </div>
      )}
    </div>
  )
}
