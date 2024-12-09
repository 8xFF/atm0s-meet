import BlurFade from '@/components/ui/blur-fade'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SidebarRight } from '@/layouts/sidebar-right'
import { useParams } from 'next/navigation'

type Props = {
  meetingLink?: string
}

export const Header: React.FC<Props> = ({ meetingLink }) => {
  const params = useParams()

  return (
    <BlurFade
      key={'zoom-header'}
      duration={0.2}
      yOffset={-4}
      className={
        'absolute -top-1 z-10 h-fit w-full rounded-b-2xl bg-opacity-100 bg-gradient-to-b from-foreground/50 to-transparent p-4'
      }
    >
      <header className="flex justify-between">
        <div className={'flex items-center'}>
          <SidebarTrigger className={'text-background'} />
          <div className="flex items-center gap-2">
            <div className="hidden text-background lg:block"> | Room ID: {params?.room}</div>
          </div>
        </div>
        <SidebarRight meetingLink={meetingLink} />
      </header>
    </BlurFade>
  )
}
