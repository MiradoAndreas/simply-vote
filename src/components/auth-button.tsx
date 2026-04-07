"use client";

import { Button } from "@/components/ui/button";

import { Show, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { UserCircleIcon, UserIcon } from "lucide-react";

export const AuthButton = ({
  collapsed = false,
}: { collapsed?: boolean }) => {


  const size = collapsed ? "1.5rem" : "3rem"


  return (
    <>
      <Show when="signed-in">
        <UserButton appearance={{
          elements: {
            userButtonAvatarBox: {
              width: size,
              height: size,
            },
          },
        }} defaultOpen={false}>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Dashboard"
              href="/cores"
              labelIcon={<UserIcon className="size-4" />}
            />

            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </Show>

      <Show when="signed-out">

        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 s border-blue-500/2 rounded-full shadow-none"
          >
            <UserCircleIcon />
            Sign in
          </Button>
        </SignInButton>
      </Show>

    </>

  );
};