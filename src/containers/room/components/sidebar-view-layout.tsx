import { Button } from '@/components/ui/button'
import { cn } from '@/lib'
import { isEmpty, map, size } from 'lodash'
import { ChevronDown, ChevronUp, UsersRound } from 'lucide-react'
import { useState } from 'react'

type Props = {
  renderItem?: (item: React.ReactNode) => React.ReactNode
  remotePeerScreens: React.ReactNode[]
  mainPeerScreen?: React.ReactNode
  showButtonExpand?: boolean
}

export const SidebarViewLayout: React.FC<Props> = ({ renderItem, remotePeerScreens, mainPeerScreen, showButtonExpand }) => {
  const [isExpand, setIsExpand] = useState(true)

  if (isEmpty(remotePeerScreens)) {
    return (
      <div className={'grid h-full max-h-[calc(100vh-168px)] w-full duration-300'}>
        {renderItem?.(mainPeerScreen || <></>) || mainPeerScreen}
      </div>
    )
  }

  return (
    <div className={'relative flex h-full w-full flex-col gap-4 duration-300'}>
      <div className={'flex-1'}>{renderItem?.(mainPeerScreen || <></>) || mainPeerScreen}</div>

      <div className={cn('h-[140px] overflow-hidden duration-300', !isExpand && 'h-0')}>
        <div className={cn('no-scrollbar flex h-[140px] w-full space-x-4 overflow-x-auto duration-300')}>
          {map(remotePeerScreens, (peer, index) => (
            <div key={index} className={'flex h-full flex-shrink-0 items-center justify-center p-1'}>
              {renderItem?.(peer || <></>) || peer}
            </div>
          ))}

          {showButtonExpand && size(remotePeerScreens) >= 1 && (
            <Button
              size={'auto'}
              onClick={() => setIsExpand((prev) => !prev)}
              className={cn('absolute right-1/2 z-[2] translate-x-1/2 rounded-2xl p-2', isExpand ? 'bottom-36' : 'bottom-0')}
            >
              {isExpand ? <ChevronDown /> : <ChevronUp />}
              <UsersRound />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
