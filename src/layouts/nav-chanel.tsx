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
import { CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronRight, UsersRound, Video } from 'lucide-react'

export const NavChanel = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-primary">Platform</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="cursor-pointer text-primary">
                <Video />
                <span>Room 1</span>
              </div>
            </SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <div className="ml-6 flex cursor-pointer items-center gap-2 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                  </span>
                  <div className="flex items-center gap-1 [&>svg]:size-4 [&>svg]:shrink-0">
                    <UsersRound />
                    <span>Person</span>
                  </div>
                </div>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
