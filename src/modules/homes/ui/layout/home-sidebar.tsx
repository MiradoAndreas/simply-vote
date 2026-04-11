"use client"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'


import { useUser } from '@clerk/nextjs'
import { Logo } from '../components/logo'
import { MainSection } from '../components/main-section'
import { PersonalSection } from '../components/personal-section'
import { AuthButton } from '@/components/auth-button'
import { ModeToggle } from '@/components/ui/toogle-mode'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'



export const HomeSidebar = () => {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const { user } = useUser()
  return (
    <Sidebar className='z-40 ' collapsible='icon'>
      <SidebarHeader className='ml-2.5 pt-9 pb-7 flex items-center flex-row'>
        <Logo />
      </SidebarHeader>
      <SidebarContent className=''>
        <MainSection />
        <PersonalSection />
      </SidebarContent>
      <SidebarFooter className='py-5'>

        <SidebarMenu >
          <SidebarGroupLabel className='uppercase'>Settings</SidebarGroupLabel>
          <SidebarMenuItem>
            <div className='pl-3'>
              <AnimatedThemeToggler />
            </div>
            <div className='py-3 w-full  bg-background rounded flex items-center justify-between pl-2.5'>
              <AuthButton collapsed={collapsed} />

              {!collapsed && (
                <p className='text-xs text-muted-foreground font-bold'>
                  {user?.emailAddresses[0].emailAddress}
                </p>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
