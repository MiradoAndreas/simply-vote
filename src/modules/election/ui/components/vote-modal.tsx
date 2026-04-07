// components/election/vote-modal.tsx
"use client"

import { useState } from "react"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { CheckCircle, Shield, Vote as VoteIcon, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface VoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  electionId: string
  candidate: {
    id: string
    name: string
    description: string | null
    imageUrl: string | null
  }
  onVoteSuccess?: () => void
}

export const VoteModal = ({
  open,
  onOpenChange,
  electionId,
  candidate,
  onVoteSuccess
}: VoteModalProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<"confirm" | "verifying" | "success">("confirm")

  const voteMutation = useMutation(
    trpc.election.voteForCandidate.mutationOptions({
      onSuccess: () => {
        toast.success("Vote enregistré avec succès !", {
          description: "Merci d'avoir participé à cette élection",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        })

        // Invalider les requêtes pour mettre à jour l'UI
        queryClient.invalidateQueries(
          {
            queryKey: trpc.election.hasUserVoted.queryKey({ electionId })
          }
        )
        queryClient.invalidateQueries(
          {
            queryKey: trpc.election.getAllCandidatesPublic.queryKey({ electionId })
          }
        )


        setStep("success")
        setTimeout(() => {
          onOpenChange(false)
          onVoteSuccess?.()
          setStep("confirm")
        }, 2000)
      },
      onError: (error) => {
        toast.error("Erreur lors du vote", {
          description: error.message,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        })
        setStep("confirm")
      },
    })
  )

  const handleVote = () => {
    setStep("verifying")
    voteMutation.mutate({
      electionId,
      candidateId: candidate.id,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <VoteIcon className="h-5 w-5 text-primary" />
                Confirmation de vote
              </DialogTitle>
              <DialogDescription>
                Vous êtes sur le point de voter pour ce candidat. Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>

            {/* Candidat */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                  {candidate.imageUrl ? (
                    <img
                      src={`/candidates/${candidate.imageUrl}.png`}
                      alt={candidate.name}

                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VoteIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{candidate.name}</h3>
                  {candidate.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {candidate.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Message de sécurité */}
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Vote sécurisé</p>
                <p className="text-xs text-muted-foreground">
                  Votre vote est anonyme et sécurisé. Vous ne pourrez pas modifier votre choix après confirmation.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleVote}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmer mon vote
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "verifying" && (
          <div className="py-8 text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <div>
              <h3 className="font-semibold text-lg">Enregistrement en cours</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Votre vote est en cours de traitement...
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Vote enregistré !</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Merci d'avoir participé à cette élection
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}