import { TRoom } from '@/types'
import { Copy, CopyCheck, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

type Props = {
  room: TRoom
}
export const RoomItem: React.FC<Props> = ({ room }) => {
  const router = useRouter()
  const [isCopy, setIsCopy] = useState(false)
  const [, onCopy] = useCopyToClipboard()

  const onJoinRoom = (room: string) => {
    router.push(`/${room}`)
  }

  const copyToClipboardMeetingLink = async () => {
    setIsCopy(true)
    await onCopy(`${window?.origin}/invite/${room.code}`)
    setTimeout(() => {
      setIsCopy(false)
    }, 2000)
  }

  return (
    <div className="flex cursor-pointer items-center justify-between text-primary [&_svg]:size-4 [&_svg]:shrink-0">
      <div onClick={() => onJoinRoom(room.code)} className="flex items-center gap-1 text-sm">
        <Video className="text-gray-400" />
        <span>{room?.name}</span>
      </div>

      <div className="[&>svg]:!size-3" onClick={copyToClipboardMeetingLink}>
        {isCopy ? <CopyCheck className="text-green-500" /> : <Copy />}
      </div>
    </div>
  )
}
