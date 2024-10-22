'use client'

import { Actions } from '.'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'
import { ScreenToggle } from '@atm0s-media-sdk/react-ui/lib'
import { Button } from '@atm0s-media-sdk/ui/components/index'
import { CopyIcon, MaximizeIcon, MinimizeIcon, PhoneMissedIcon, XIcon } from '@atm0s-media-sdk/ui/icons/index'
import { Logo } from '@/components'
import { useFullScreen } from '@/hooks'

type Props = {
  meetingLink: string
}

export const BottomBar: React.FC<Props> = ({ meetingLink }) => {
  const params = useParams()
  const router = useRouter()
  const [, onCopy] = useCopyToClipboard()
  const { isMaximize, onOnOffFullScreen } = useFullScreen()
  const [isCreateNewRoom, setIsCreateNewRoom] = useState(true)

  const onCopyInviteLink = () => {
    onCopy(meetingLink as string).then(() => {
      toast.success('Copied invite link', { duration: 2000 })
    })
  }

  return (
    <div className="w-full relative flex items-center justify-between py-3 border-t pl-4 pr-[calc(16px*2+40px)]">
      <div className="flex items-center gap-2">
        <Logo />
        {/* <div className="text-base hidden lg:block">| Room ID: {params?.room}</div> */}
        <Button variant="secondary" size="icon" onClick={onCopyInviteLink}>
          <CopyIcon size={16} />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Actions />
        <ScreenToggle source_name="video_screen" />
        <Button variant="secondary" size="icon" onClick={onOnOffFullScreen}>
          {!isMaximize ? <MaximizeIcon size={16} /> : <MinimizeIcon size={16} />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            const audio = new Audio('/sound-out.mp3')
            audio.play()
            router.push('/')
          }}
        >
          <PhoneMissedIcon size={16} />
        </Button>
      </div>
      {isCreateNewRoom && (
        <div className="absolute left-4 bottom-[calc(100%+16px)] w-[360px] bg-muted rounded-xl">
          <div className="flex items-center justify-between pl-4 pr-3 py-2">
            <div>Your meeting's ready</div>
            <Button variant="ghost" size="icon" onClick={() => setIsCreateNewRoom(false)}>
              <XIcon size={16} />
            </Button>
          </div>
          <div className="px-4 pb-4 grid gap-4">
            <div className="text-muted-foreground text-xs">Share this meeting link with others you want in the meeting</div>
            <div className="flex items-center gap-2 h-10 bg-gray-50 text-black underline rounded pl-3">
              <div className="flex-1 text-sm">{meetingLink}</div>
              <Button variant="link" size="icon" onClick={onCopyInviteLink}>
                <CopyIcon size={16} color="#000" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
