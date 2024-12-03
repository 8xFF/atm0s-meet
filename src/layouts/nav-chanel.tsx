import { Collapsible } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'
import RoomManager from '@/lib/room'
import type { TRoom } from '@/types'
import { CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronRight, Video } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export const NavChanel = () => {
  const [rooms, setRooms] = useState([] as TRoom[])
  console.log('🧙 ~ rooms:', rooms)

  useEffect(() => {
    RoomManager.getAllRooms().then(({ rooms }) => setRooms(rooms))
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-primary">Room</SidebarGroupLabel>
      <SidebarMenu>
        {rooms?.map((room) => (
          <Collapsible asChild defaultOpen key={room?.code}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="cursor-pointer text-primary">
                  <Video />
                  <span>{room?.name}</span>
                </div>
              </SidebarMenuButton>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="data-[state=open]:rotate-90">
                  <ChevronRight />
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {room.users.map((user) => (
                  <SidebarMenuSub key={user.gmail}>
                    <div className="ml-6 flex cursor-pointer items-center gap-2 text-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                      </span>
                      <div className="flex items-center gap-1 [&>svg]:size-3 [&>svg]:shrink-0">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                          unoptimized
                        />
                        <span>{user.name}</span>
                      </div>
                    </div>
                  </SidebarMenuSub>
                ))}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
