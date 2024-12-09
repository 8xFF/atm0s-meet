'use client'

import { useClerk, useUser } from '@clerk/nextjs'

type Props = {}

export const Username: React.FC<Props> = ({}) => {
  const { signOut } = useClerk()
  const { user } = useUser()
  const fullName = user?.fullName

  return (
    <>
      Logged in as {fullName} |{' '}
      <span className="cursor-pointer underline" onClick={() => signOut()}>
        Logout
      </span>
    </>
  )
}
