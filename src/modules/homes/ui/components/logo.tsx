"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { NfcIcon } from "lucide-react"
import Image from "next/image"


export const Logo = () => {
  const { state } = useSidebar()
  
  const collapsable = state === "collapsed"
  return (
    <>
      {collapsable ? (

        <div className="flex justify-between bg-primary p-0 items-center max-w-fit rounded-full">
          <NfcIcon className="size-5" />
        </div>
      ) : (
        <>
           <Image
        src="/logos/logolight.svg"
        alt="logo"
        width={120}
        height={40}
        className="block dark:hidden"
      />
      <Image
        src="/logos/newlogo.svg"
        alt="logo"
        width={120}
        height={40}
        className="hidden dark:block"
      />
    </>
  )
        
    }

    </>
  )
}
