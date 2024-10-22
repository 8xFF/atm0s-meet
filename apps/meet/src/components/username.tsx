'use client'

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { useRouter } from 'next/navigation'
import { removeCookie } from '@atm0s-media-sdk/ui/lib/cookies'

type Props = {
  username?: RequestCookie
}

export const Username: React.FC<Props> = ({ username }) => {
  const router = useRouter()

  const onLogout = () => {
    removeCookie('username')
    router.push('/settings-username')
  }
  console.log('username', username)
  return (
    <>
      Hello {username?.value}
    </>
  )
}
