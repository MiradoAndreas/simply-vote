// components/hero-section.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Shield,
  Sparkles,
  Play,
  ChevronRight,
  GraduationCap,
  Users,
  Calendar,
  Trophy,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
        <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-32 md:pt-32 md:pb-40 relative">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="animate-fade-in-up">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium gap-2 bg-primary/10 text-primary border-primary/20"
            >
              <GraduationCap className="h-3 w-3" />
              Plateforme de vote étudiante
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              <span className="text-xs">SimplyVote Éducation</span>
            </Badge>
          </div>

          {/* Titre principal */}
          <div className="space-y-4 max-w-4xl animate-fade-in-up animation-delay-200">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Élection AEPC - VOTE {" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  EN LIGNE
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full" />
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Votez toute en simplicité sur la plateforme <span className="text-primary">
                SIMPLY VOTE
              </span>
            </p>
          </div>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
            <Button size="lg" className="gap-2 group relative overflow-hidden" asChild>
              <Link href="/go-vote">
                <span className="relative z-10 flex items-center gap-2">
                  Voter des élections étudiantes
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 group" asChild>
              <Link href="/results">
                <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Voir les resultats
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Valeurs clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 w-full max-w-3xl animate-fade-in-up animation-delay-600">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% sécurisé</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>Choisir votre étudiants</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Date élection fixe</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-primary" />
              <span>Transparence totale</span>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}