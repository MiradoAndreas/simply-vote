"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { NfcIcon } from "lucide-react"


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
          <div className="flex justify-between bg-primary p-3 items-center max-w-fit rounded-full">
            <NfcIcon className="size-7" />
          </div>
          <div className="flex flex-col gap-y-0">
            <h1 className="text-bold font-extrabold uppercase  text-2xl leading-none">Simply</h1>
            <h2 className="text-xl ">Vote</h2>
          </div>
        </>
      )}

    </>
  )
}
