'use client'

import { CameraPreview, Logo, Username } from '@/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from '@atm0s-media-sdk/react-hooks'
import { ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Actions } from './components'

type Props = {
  onConnected: () => void
}

export const SettingsMedia: React.FC<Props> = ({ onConnected }) => {
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
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-xs md:max-w-sm">
        <CardHeader>
          <CardTitle>
            <Logo />
          </CardTitle>
          <CardDescription>
            <Username />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Room ID: {params?.room}</div>
            <CameraPreview sourceName="video_main" />
          </div>
          <div className="flex items-center gap-4">
            <Actions isFirstPage />
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
          <Button loading={isLoading} className="w-full flex-1" onClick={onJoin}>
            Join
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
