import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HomeSidebar } from "./home-sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <div className="flex min-h-sreen">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto">
            <SidebarTrigger />
            {children}

          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
