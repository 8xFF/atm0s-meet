'use client'

import { Toaster } from 'sonner'

import { TooltipProvider } from '@/components/ui/tooltip'
import { JotaiProvider } from '@/providers/jotai-provider'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import dynamic from 'next/dynamic'
type Props = {
  children: React.ReactNode
}

const ThemeProvider = dynamic(() => import('./theme-provider').then((mod) => mod.ThemeProvider), { ssr: false })

export const AppProvider: React.FC<Props> = ({ children }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ReactQueryProvider>
          <JotaiProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </JotaiProvider>
        </ReactQueryProvider>
      </ThemeProvider>
      <Toaster />
    </>
  )
}
