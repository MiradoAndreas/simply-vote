"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Trophy, Users, Calendar, Clock, Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { ElectionTimer } from "../components/election-timer"

import { Button } from "@/components/ui/button"


interface ElectionResultsProps {
  electionId: string
}

// Fonction pour obtenir les couleurs CSS résolues
const getChartColor = (variable: string): string => {
  if (typeof window === 'undefined') return `var(${variable})`
  const colorValue = getComputedStyle(document.documentElement).getPropertyValue(variable)
  return colorValue || `var(${variable})`
}

export const AllResultsPublicByElectionIdSection = ({ electionId }: ElectionResultsProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <AllResultsPublicByElectionIdSectionSuspense electionId={electionId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const AllResultsPublicByElectionIdSectionSuspense = ({ electionId }: ElectionResultsProps) => {

  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const [colors, setColors] = useState({
    primary: "#1596e0",
    secondary: "#4a2fe0",
    accent: "#7a5fe0",
    chart4: "#22c55e",
    chart5: "#eab308",
    mutedForeground: "#6b7280"
  })

  // Hook pour les couleurs - TOUJOURS avant les conditions
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

  // Hook useQuery - TOUJOURS avant les conditions
  const { data: resultsData, isLoading } = useQuery(
    trpc.election.getElectionResults.queryOptions({
      electionId,
    })
  )

  // Timer complet (optionnel, car on utilise ElectionTimer)
  const handleTimerComplete = () => {
    queryClient.invalidateQueries(
      trpc.election.getElectionResults.queryOptions({ electionId })
    )
  }

  // Conditions de rendu APRÈS tous les hooks
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

  // Si les résultats ne sont pas disponibles, afficher le timer
  if (!resultsData.statistics.isAvailable && resultsData.election.endDate) {
    return (
      <>

        <ElectionTimer
          endDate={new Date(resultsData.election.endDate)}
          onComplete={handleTimerComplete}
        /></>
    )
  }

  // Sinon, afficher les résultats
  const { election, results, statistics } = resultsData
  const winner = results[0]

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
      {/* En-tête avec les infos de l'élection */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription>{election.description || "Aucune description"}</CardDescription>
            </div>
            <Badge variant="secondary">
              {statistics.isElectionEnded ? "Élection terminée" : "En cours"}
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
                <p className="text-muted-foreground">Participants</p>
                <p className="font-medium">{statistics.totalVotes} votes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="text-muted-foreground">Participation</p>
                <p className="font-medium">{statistics.participationRate}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gagnant */}
      {winner && winner.voteCount > 0 && (
        <Card className="border-primary/20 bg-linear-to-r from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <CardTitle>Vainqueur</CardTitle>
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
            {results.map((candidate, index) => (
              <div
                key={candidate.id}
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors ${index === 0 ? "bg-primary/5 border border-primary/20" : ""
                  }`}
              >
                <div className={`w-8 text-center font-bold text-lg ${index === 0 ? "text-primary" : "text-muted-foreground"
                  }`}>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}