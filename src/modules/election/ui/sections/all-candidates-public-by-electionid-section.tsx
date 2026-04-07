"use client"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useTRPC } from "@/trpc/client"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { CheckCircle, Star, Users, VoteIcon } from "lucide-react"
import Image from "next/image"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { VoteStatus } from "../components/vote-status"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { VoteModal } from "../components/vote-modal"

interface Props {
  electionId: string
}

export const AllCandidatesPublicByElectionIdSection = ({ electionId }: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error!</div>}>
        <AllCandidatesPublicByElectionIdSectionSuspense electionId={electionId} />
      </ErrorBoundary>
    </Suspense>
  )
}


const AllCandidatesPublicByElectionIdSectionSuspense = ({ electionId }: Props) => {
  const trpc = useTRPC()
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: candidates } = useSuspenseQuery(
    trpc.election.getAllCandidatesPublic.queryOptions({
      electionId: electionId
    })
  )

  const { data: voteStatus } = useSuspenseQuery(
    trpc.election.hasUserVoted.queryOptions({ electionId })
  )

  const hasVoted = voteStatus?.hasVoted || false

  const handleVoteClick = (candidate: Candidate) => {
    if (hasVoted) return
    setSelectedCandidate(candidate)
    setModalOpen(true)
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Aucun candidat</h3>
        <p className="text-muted-foreground">
          Aucun candidat n'a encore été ajouté à cette élection
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header avec compteur et statut */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <VoteStatus electionId={electionId} />
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              {candidates.length} Candidat{candidates.length > 1 ? 's' : ''}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              {hasVoted ? "Vote déjà effectué" : "Choisissez votre candidat"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {hasVoted
                ? "Vous avez déjà participé à cette élection. Merci pour votre engagement !"
                : "Découvrez les candidats et leurs programmes pour faire votre choix"
              }
            </p>
          </div>
        </div>

        {/* Grille des candidats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map((candidate: Candidate, index: number) => {
            const candidateNumber = candidate.order !== null ? candidate.order + 1 : index + 1

            return (
              <Card
                key={candidate.id}
                className={cn(
                  "group pt-0 rounded-none overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-b from-background to-muted/20",
                  hasVoted && "opacity-75"
                )}
              >
                {/* Section image */}
                <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-primary/5 to-primary/10">
                  {candidate.imageUrl ? (
                    <img
                      src={`/candidates/${candidate.imageUrl}.png`}
                      alt={candidate.name}

                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Users className="h-20 w-20 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Photo non disponible</p>
                      </div>
                    </div>
                  )}

                  {/* Badge numéro */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                      <span className="font-bold text-lg">#{candidateNumber}</span>
                    </div>
                  </div>

                  {/* Badge déjà voté */}
                  {hasVoted && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-green-500 text-white gap-2 px-4 py-2">
                        <CheckCircle className="h-4 w-4" />
                        Vote enregistré
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Section informations */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {candidate.name}
                    </h3>
                    {candidate.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {candidate.description}
                      </p>
                    )}
                  </div>

                  {/* Bouton voter */}
                  <Button
                    className="w-full gap-2"
                    variant={hasVoted ? "outline" : "default"}
                    disabled={hasVoted}
                    onClick={() => handleVoteClick(candidate)}
                  >
                    {hasVoted ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Vote déjà effectué
                      </>
                    ) : (
                      <>
                        <VoteIcon className="h-4 w-4" />
                        Choisir ce candidat
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Modal de vote */}
      {selectedCandidate && (
        <VoteModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          electionId={electionId}
          candidate={{
            id: selectedCandidate.id,
            name: selectedCandidate.name,
            description: selectedCandidate.description,
            imageUrl: selectedCandidate.imageUrl,
          }}
          onVoteSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: trpc.election.getAllCandidatesPublic.queryKey({
                electionId
              })
            })
            queryClient.invalidateQueries({
              queryKey: trpc.election.hasUserVoted.queryKey({
                electionId
              })
            })
          }}
        />
      )}
    </>
  )
}
interface Candidate {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  order: number | null
}

const CandidateCard = ({ candidate, index }: { candidate: Candidate; index: number }) => {
  return (
    <Card className="group pt-0  rounded-none overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-b from-background to-muted/20">
      {/* Section image */}
      <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-primary/5 to-primary/10">
        {candidate.imageUrl ? (
          <img
            src={`/candidates/${candidate.imageUrl}.png`}
            alt={candidate.name}

            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Users className="h-20 w-20 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Photo non disponible</p>
            </div>
          </div>
        )}

        {/* Badge numéro */}
        <div className="absolute top-4 left-4">
          <div className="bg-background/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
            <span className="font-bold text-lg">#{index + 1}</span>
          </div>
        </div>

        {/* Badge vote */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge className="bg-primary text-primary-foreground gap-1">
            <Star className="h-3 w-3" />
            Voter
          </Badge>
        </div>
      </div>

      {/* Section informations */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {candidate.name}
          </h3>
          {candidate.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {candidate.description}
            </p>
          )}
        </div>

        {/* Bouton voter */}
        <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
          <CheckCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          Choisir ce candidat
        </button>
      </div>
    </Card>
  )
}
