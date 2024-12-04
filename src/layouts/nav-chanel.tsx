import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'
import { RoomStore } from '@/stores/room'
import { useAtom } from 'jotai'
import { RoomItem } from './room-item'

export const NavChanel = () => {
  const [rooms] = useAtom(RoomStore.data)

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-primary">Room</SidebarGroupLabel>
      <SidebarMenu className="gap-4">
        {rooms?.map((room) => (
          <SidebarMenuItem key={room?.code}>
            <SidebarMenuButton asChild className="mb-3">
              <RoomItem room={room} />
            </SidebarMenuButton>
            {room.users.map((user) => (
              <SidebarMenuSub key={user.gmail}>
                <div className="ml-6 flex cursor-pointer items-center gap-2 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                  </span>
                  <div className="flex items-center gap-1 [&>svg]:size-3 [&>svg]:shrink-0">
                    {/* <Image
                      src={user.avatar}
                      alt={user.name}
                      width={20}
                      height={20}
                      className={cn('rounded-full', !user.avatar && 'invisible opacity-0')}
                      unoptimized
                    /> */}

                    <span>{user.name}</span>
                  </div>
                </div>
              </SidebarMenuSub>
            ))}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
