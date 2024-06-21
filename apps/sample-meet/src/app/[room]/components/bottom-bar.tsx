'use client'

import { Actions } from '.'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@atm0s-media-sdk/ui/components/index'
import { PhoneMissedIcon } from '@atm0s-media-sdk/ui/icons/index'
import { Logo } from '@/components'

export const BottomBar = () => {
  const router = useRouter()
  const params = useParams()
  return (
    <div className="w-full flex items-center justify-between py-3 border-t pl-4 pr-[calc(16px*2+40px)]">
      <div className="flex items-center gap-2">
        <Logo />
        <div className="text-xl hidden lg:block">| Room ID: {params?.room}</div>
      </div>
      <div className="flex items-center gap-4">
        <Actions />
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
    </div>
  )
}