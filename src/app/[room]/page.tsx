import { Room } from '@/containers'
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()

  const host = headersList.get('host')

  return <Room host={host} />
}
