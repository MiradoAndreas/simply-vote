// components/footer.tsx
"use client"

import { Heart } from "lucide-react"

export const FooterSection = () => {
  return (
    <footer className="border-t border-border/50 py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SimplyVote
          </p>
          <span className="hidden sm:inline text-muted-foreground/30">•</span>
          <p className="text-sm text-muted-foreground">
            Fait avec <Heart className="h-3.5 w-3.5 inline text-red-500 animate-pulse" /> pour la communauté étudiante
          </p>
        </div>
      </div>
    </footer>
  )
}