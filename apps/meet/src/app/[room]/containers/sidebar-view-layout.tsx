import { map } from 'lodash'
import { FC, useMemo } from 'react'
import { cn } from '@atm0s-media-sdk/ui/lib/utils'

type Props = {
  renderItem: (item: number) => React.ReactNode
  items: any[]
}

export const SidebarViewLayout: FC<Props> = ({ renderItem, items }) => {
  const totalUser = items.length

  const renderItems = useMemo(() => {
    if (totalUser > 1 ) {
      return (
        <>
          <div className={'w-full duration-300 h-full'}>
            {renderItem(items?.[0])}
          </div>

          <div className={'overflow-auto h-full'}>
            {map(items, (item, index) => {
              return index != 0 && (
                <div key={index} className={cn('w-full h-36 duration-300', items?.[index+1] && 'mb-4')}>
                  {renderItem(item)}
                </div>
              )
            })}
          </div>
        </>
      )
    }

    return (
      map(items, (item, index) => {
        return (
          <div key={index} className={'w-full h-full duration-300'}>
            {renderItem(item)}
          </div>
        )
      })
    )
  }, [items, renderItem, totalUser])

  return (
    <div className={'grid w-screen h-full max-h-[calc(100vh-65px)] grid-cols-[minmax(auto,_1fr)_220px] gap-4 duration-300 p-4'}>{renderItems}</div>
  )
}
