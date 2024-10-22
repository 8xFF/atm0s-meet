'use client'

import { Actions } from '../components'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession } from '@atm0s-media-sdk/react-hooks'
import { CameraPreview } from '@atm0s-media-sdk/react-ui/lib'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@atm0s-media-sdk/ui/components/index'
import { ChevronLeftIcon } from '@atm0s-media-sdk/ui/icons/index'
import { Logo, Username } from '@/components'

type Props = {
  onConnected: () => void
  username?: RequestCookie
}

export const SettingsMedia: React.FC<Props> = ({ onConnected, username }) => {
  const router = useRouter()
  const params = useParams()
  const session = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const onJoin = () => {
    setIsLoading(true)
    session
      .connect()
      .then(() => {
        const audio = new Audio('/sound-in.mp3')
        audio.play()
        setIsLoading(false)
        onConnected()
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return (
    <Card className="w-full max-w-xs md:max-w-sm">
      <CardHeader>
        <CardTitle>
          <Logo />
        </CardTitle>
        <CardDescription>
          <Username username={username} />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          {/* <div className="text-sm font-medium">Room ID: {params?.room}</div> */}
          <CameraPreview source_name="video_main" />
          {/* <div className="text-sm text-muted-foreground">0 user(s) in the room</div> */}
        </div>
        <div className="flex items-center gap-4">
          <Actions first_page />
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => {
            router.replace('/')
          }}
        >
          <ChevronLeftIcon size={16} />
        </Button>
        <Button isLoading={isLoading} className="w-full flex-1" onClick={onJoin}>
          Join
        </Button>
      </CardFooter>
    </Card>
  )
}
