// components/auth/unauthorized.tsx
"use client"

import { Shield, AlertTriangle, ArrowLeft, Home, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface UnauthorizedProps {
  title?: string
  description?: string
  showBackButton?: boolean
  showHomeButton?: boolean
  contactEmail?: string
}

export const Unauthorized = ({
  title = "Accès non autorisé",
  description = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  showBackButton = true,
  showHomeButton = true,
  contactEmail = "support@simplyvote.com",
}: UnauthorizedProps) => {
  const router = useRouter()

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <Card className="max-w-md rounded-none pt-0 w-full text-center overflow-hidden border-destructive/20">
        {/* Bandeau d'avertissement */}
        <div className="h-6 bg-linear-to-r from-destructive/80 to-destructive" />

        <CardHeader className="space-y-4 pt-8">
          {/* Icône */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl" />
              <div className="relative bg-destructive/10 p-4 rounded-full inline-flex">
                <Shield className="h-12 w-12 text-destructive" />
              </div>
            </div>
          </div>

          {/* Titre */}
          <CardTitle className="text-2xl font-bold text-destructive">
            {title}
          </CardTitle>

          {/* Description */}
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Message d'information */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Page réservée aux administrateurs</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'équipe technique.
            </p>
          </div>

          {/* Email de contact */}
          {contactEmail && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary hover:underline transition-colors"
              >
                {contactEmail}
              </a>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-8">
          {/* Boutons d'action */}
          <div className="flex gap-3 w-full">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            )}

            {showHomeButton && (
              <Button
                asChild
                className="flex-1 gap-2"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Accueil
                </Link>
              </Button>
            )}
          </div>

          {/* Code d'erreur */}
          <p className="text-xs text-muted-foreground mt-4">
            Code d'erreur: 403 - Forbidden
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}