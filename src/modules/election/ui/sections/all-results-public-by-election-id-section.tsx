"use client"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Trophy, Users, Calendar, Clock, Loader2, ArrowLeft, ArrowRight, AlertCircle, Vote } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { ElectionTimer } from "../components/election-timer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface ElectionResultsProps {
  electionId: string
}

// Types pour le second tour
interface SecondRoundCandidate {
  id: string
  name: string
  voteCount: number
  percentage: number
}

// Composants Skeleton (garde les mêmes que tu avais)
const ResultsLoadingSkeleton = () => { /* ... reste identique ... */ }
const ChartSkeleton = () => { /* ... reste identique ... */ }
const ResultRowSkeleton = ({ isWinner = false }) => { /* ... reste identique ... */ }

// Fonction pour obtenir les couleurs CSS résolues
const getChartColor = (variable: string): string => {
  if (typeof window === 'undefined') return `var(${variable})`
  const colorValue = getComputedStyle(document.documentElement).getPropertyValue(variable)
  return colorValue || `var(${variable})`
}

export const AllResultsPublicByElectionIdSection = ({ electionId }: ElectionResultsProps) => {
  return (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <AllResultsPublicByElectionIdSectionSuspense electionId={electionId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const AllResultsPublicByElectionIdSectionSuspense = ({ electionId }: ElectionResultsProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isCreatingSecondRound, setIsCreatingSecondRound] = useState(false)

  const [colors, setColors] = useState({
    primary: "#1596e0",
    secondary: "#4a2fe0",
    accent: "#7a5fe0",
    chart4: "#22c55e",
    chart5: "#eab308",
    mutedForeground: "#6b7280"
  })

  useEffect(() => {
    const updateColors = () => {
      setColors({
        primary: getChartColor('--primary') || "#1596e0",
        secondary: getChartColor('--secondary') || "#4a2fe0",
        accent: getChartColor('--accent') || "#7a5fe0",
        chart4: getChartColor('--chart-4') || "#22c55e",
        chart5: getChartColor('--chart-5') || "#eab308",
        mutedForeground: getChartColor('--muted-foreground') || "#6b7280"
      })
    }

    updateColors()
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const { data: resultsData, isLoading, refetch } = useQuery(
    trpc.election.getElectionResults.queryOptions({
      electionId,
    })
  )

  const createSecondRoundMutation = useMutation(
    trpc.election.createSecondRound.mutationOptions({
      onSuccess: (data) => {
        toast.success("Second tour créé avec succès !", {
          description: `L'élection "${data.election.title}" a été créée.`,
        })
        setDialogOpen(false)
        setIsCreatingSecondRound(false)
        router.push(`/all-election/${data.election.id}`)
      },
      onError: (error) => {
        toast.error("Erreur lors de la création du second tour", {
          description: error.message,
        })
        setIsCreatingSecondRound(false)
      },
    })
  )

  const handleTimerComplete = () => {
    queryClient.invalidateQueries(
      trpc.election.getElectionResults.queryOptions({ electionId })
    )
  }

  const handleCreateSecondRound = async () => {
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les dates du second tour")
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end <= start) {
      toast.error("La date de fin doit être après la date de début")
      return
    }

    if (start < new Date()) {
      toast.error("La date de début ne peut pas être dans le passé")
      return
    }

    setIsCreatingSecondRound(true)

    createSecondRoundMutation.mutate({
      originalElectionId: electionId,
      candidate1Id: resultsData?.statistics.secondRoundCandidates?.candidate1.id!,
      candidate2Id: resultsData?.statistics.secondRoundCandidates?.candidate2.id!,
      startDate: start,
      endDate: end,
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!resultsData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Aucun résultat disponible</p>
        </CardContent>
      </Card>
    )
  }

  if (!resultsData.statistics.isAvailable && resultsData.election.endDate) {
    return (
      <ElectionTimer
        endDate={new Date(resultsData.election.endDate)}
        onComplete={handleTimerComplete}
      />
    )
  }

  const { election, results, statistics } = resultsData
  const winner = results[0]
  const needsSecondRound = statistics.needsSecondRound
  const secondRoundCandidates = statistics.secondRoundCandidates

  // Préparer les données pour les graphiques
  const barChartData = results.map(candidate => ({
    name: candidate.name.length > 20 ? candidate.name.substring(0, 20) + "..." : candidate.name,
    votes: candidate.voteCount,
    percentage: candidate.percentage.toFixed(1),
    imageUrl: candidate.imageUrl || "/default-avatar.png"
  }))

  const pieChartData = results.map(candidate => ({
    name: candidate.name,
    value: candidate.voteCount,
    percentage: candidate.percentage,
  }))

  const pieColors = [
    colors.primary,
    colors.secondary,
    colors.accent,
    colors.chart4,
    colors.chart5,
    colors.mutedForeground,
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <Button variant="outline" onClick={() => router.forward()}>
          Suivant <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Alert pour le second tour */}
        {needsSecondRound && secondRoundCandidates && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-600 dark:text-amber-400">
              Second tour nécessaire
            </AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                Aucun candidat n&apos;a atteint 50% des votes. Un second tour aura lieu entre
                <strong className="mx-1 text-primary">{secondRoundCandidates.candidate1.name}</strong>
                et
                <strong className="ml-1 text-primary">{secondRoundCandidates.candidate2.name}</strong>.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>{secondRoundCandidates.candidate1.name}: {secondRoundCandidates.candidate1.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span>{secondRoundCandidates.candidate2.name}: {secondRoundCandidates.candidate2.percentage.toFixed(1)}%</span>
                </div>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="gap-2 mt-2">
                    <Vote className="h-4 w-4" />
                    Organiser le second tour
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Organiser le second tour</DialogTitle>
                    <DialogDescription>
                      Créez une nouvelle élection pour le second tour entre les deux candidats qualifiés.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Candidats qualifiés</Label>
                      <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1 text-center p-2 bg-primary/10 rounded-lg">
                          <p className="font-semibold">{secondRoundCandidates.candidate1.name}</p>
                          <p className="text-xs text-muted-foreground">{secondRoundCandidates.candidate1.percentage.toFixed(1)}%</p>
                        </div>
                        <div className="flex items-center text-muted-foreground">VS</div>
                        <div className="flex-1 text-center p-2 bg-secondary/10 rounded-lg">
                          <p className="font-semibold">{secondRoundCandidates.candidate2.name}</p>
                          <p className="text-xs text-muted-foreground">{secondRoundCandidates.candidate2.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de début *</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Date de fin *</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateSecondRound} disabled={isCreatingSecondRound}>
                      {isCreatingSecondRound ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Création...
                        </>
                      ) : (
                        <>
                          <Vote className="h-4 w-4 mr-2" />
                          Créer le second tour
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </AlertDescription>
          </Alert>
        )}

        {/* En-tête avec les infos de l'élection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{election.title}</CardTitle>
                <CardDescription>{election.description || "Aucune description"}</CardDescription>
              </div>
              <Badge variant={needsSecondRound ? "outline" : "secondary"}>
                {needsSecondRound ? "Second tour requis" : (statistics.isElectionEnded ? "Élection terminée" : "En cours")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-muted-foreground">Début</p>
                  <p className="font-medium">{format(new Date(election.startDate), "PPP", { locale: fr })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-muted-foreground">Fin</p>
                  <p className="font-medium">{format(new Date(election.endDate), "PPP", { locale: fr })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-muted-foreground">Electeurs</p>
                  <p className="font-medium">{statistics.totalVotes} votes</p>
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-muted-foreground">Participation</p>
                  <p className="font-medium">{statistics.participationRate}%</p>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Gagnant - Afficher uniquement si pas de second tour nécessaire */}
        {!needsSecondRound && winner && winner.voteCount > 0 && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <CardTitle>Candidat élu</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
                  {winner.imageUrl ? (
                    <img src={`/candidates/${winner.imageUrl}.png`} alt={winner.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{winner.name}</h3>
                  <p className="text-muted-foreground">
                    {winner.voteCount} vote{winner.voteCount > 1 ? "s" : ""} ({winner.percentage.toFixed(1)}%)
                  </p>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Gagnant
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Graphiques */}
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="bar">Affichage par nombre de vote</TabsTrigger>
            <TabsTrigger value="pie">Affichage par pourcentage</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <Card>
              <CardHeader>
                <CardTitle>Résultats des votes</CardTitle>
                <CardDescription>Nombre de votes par candidat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barChartData} layout="vertical" margin={{ left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fill: "#6b7280" }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tick={({ x, y, payload }) => {
                          const candidate = barChartData.find(c => c.name === payload.value)
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <foreignObject x={-75} y={-12} width={100} height={24}>
                                <div className="flex items-center gap-2">
                                  <img
                                    src={`/candidates/${candidate?.imageUrl}.png`}
                                    alt={payload.value}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <span className="text-sm truncate">{payload.value}</span>
                                </div>
                              </foreignObject>
                            </g>
                          )
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          color: "#111827"
                        }}
                      />
                      <Legend wrapperStyle={{ color: "#6b7280" }} />
                      <Bar dataKey="votes" fill={colors.primary} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pie">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des votes</CardTitle>
                <CardDescription>Distribution en pourcentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(1)}%`}
                        outerRadius={150}
                        fill={colors.primary}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${value} votes`}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          color: "#111827"
                        }}
                      />
                      <Legend wrapperStyle={{ color: "#6b7280" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tableau détaillé des résultats */}
        <Card>
          <CardHeader>
            <CardTitle>Détail des résultats</CardTitle>
            <CardDescription>Classement complet des candidats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((candidate, index) => {
                const isSecondRoundCandidate = secondRoundCandidates && (
                  candidate.id === secondRoundCandidates.candidate1.id ||
                  candidate.id === secondRoundCandidates.candidate2.id
                )

                return (
                  <div
                    key={candidate.id}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors ${index === 0 ? "bg-primary/5 border border-primary/20" : ""
                      } ${isSecondRoundCandidate && needsSecondRound ? "ring-1 ring-amber-500/50 bg-amber-500/5" : ""
                      }`}
                  >
                    <div className={`w-8 text-center font-bold text-lg ${index === 0 ? "text-primary" : "text-muted-foreground"}`}>
                      #{index + 1}
                    </div>
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
                      {candidate.imageUrl ? (
                        <img src={`/candidates/${candidate.imageUrl}.png`} alt={candidate.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${index === 0 ? "text-primary" : ""}`}>
                        {candidate.name}
                        {isSecondRoundCandidate && needsSecondRound && (
                          <Badge variant="outline" className="ml-2 text-xs bg-amber-500/10 border-amber-500/30 text-amber-600">
                            Qualifié pour le second tour
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {candidate.description || "Aucune description"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{candidate.voteCount}</p>
                      <p className="text-sm text-muted-foreground">vote{candidate.voteCount > 1 ? "s" : ""}</p>
                    </div>
                    <div className="w-20 text-right">
                      <p className={`font-semibold ${index === 0 ? "text-primary" : ""}`}>
                        {candidate.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}