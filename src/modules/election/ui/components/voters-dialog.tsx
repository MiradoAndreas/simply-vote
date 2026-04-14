// components/election/voters-dialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Mail, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface VotersDialogProps {
  candidateName: string
  voters: Array<{
    id: string
    email: string
    imageUrl: string | null
  }>
  voteCount: number
  children?: React.ReactNode
}

export const VotersDialog = ({
  candidateName,
  voters,
  voteCount,
  children,
}: VotersDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <Users className="h-3 w-3" />
            {voteCount} votant{voteCount > 1 ? "s" : ""}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Votants - {candidateName}
          </DialogTitle>
          <DialogDescription>
            {voteCount} étudiant{voteCount > 1 ? "s ont" : " a"} voté pour ce candidat
          </DialogDescription>
        </DialogHeader>

        {voters.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun votant pour ce candidat</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {voters.map((voter) => (
                <div
                  key={voter.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={voter.imageUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {voter.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{voter.email}</p>
                    <p className="text-xs text-muted-foreground">Étudiant</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}