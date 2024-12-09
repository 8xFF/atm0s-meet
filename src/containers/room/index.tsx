'use client'

import { env } from '@/config'
import { Layout } from '@/layouts'
import { MediaProvider } from '@/providers'
import { AudioMixerMode, SessionConfig } from '@atm0s-media-sdk/core'
import { Atm0sMediaProvider } from '@atm0s-media-sdk/react-hooks'
import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Meeting } from './meeting'
import { SettingsMedia } from './settings-media'

type Props = {
  host: string | null
}

export const Room: React.FC<Props> = ({ host }) => {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = searchParams!.get('token') || ''
  const room = params?.room as string
  const peer = searchParams!.get('peer') || ''

  const cfg = {
    token,
    join: {
      room,
      peer,
      publish: { peer: true, tracks: true },
      subscribe: { peers: true, tracks: true },
      features: {
        mixer: {
          mode: AudioMixerMode.AUTO,
          outputs: 3,
        },
      },
    },
  } as SessionConfig

  const [inRoom, setInRoom] = useState(false)

  return (
    <Atm0sMediaProvider gateway={env.GATEWAYS} cfg={cfg} prepareAudioReceivers={3} prepareVideoReceivers={3}>
      <Layout>
        <MediaProvider>
          {!inRoom && <SettingsMedia onConnected={() => setInRoom(true)} />}
          {inRoom && <Meeting host={host} />}
        </MediaProvider>
      </Layout>
    </Atm0sMediaProvider>
  )
}
