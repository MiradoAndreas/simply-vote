"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from "zod"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import Image from "next/image"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

// Schéma de validation avec Zod
const candidateSchema = z.object({
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  imageUrl: z.string()
    .min(1, "L'URL de la photo est requise")
    .startsWith("/", "L'URL doit commencer par / pour les images locales"),
  description: z.string().optional(),
})

type CandidateFormValues = z.infer<typeof candidateSchema>

interface CreateCandidateFormProps {
  electionId: string
}

export const CreateCandidateForm = ({ electionId }: CreateCandidateFormProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<CandidateFormValues>({
    resolver: standardSchemaResolver(candidateSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      description: "",
    },
  })

  const createCandidate = useMutation(
    trpc.election.createCandidate.mutationOptions({
      onSuccess: () => {
        toast.success("Candidat ajouté avec succès")
        queryClient.invalidateQueries({
          queryKey: trpc.election.getAllCandidates.queryKey({
            electionId: electionId
          })
        })
        setOpen(false)
        form.reset() // Reset le formulaire
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const onSubmit = (values: CandidateFormValues) => {
    createCandidate.mutate({
      electionId,
      name: values.name,
      description: values.description,
      imageUrl: values.imageUrl,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un candidat
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-5">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau candidat</DialogTitle>
          <DialogDescription>
            Remplissez les informations du candidat pour l'élection
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Champ Nom */}
            <Field>
              <FieldLabel htmlFor="name">Nom du candidat *</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Jean Dupont"
                disabled={createCandidate.isPending}
                {...form.register("name")}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <FieldError errors={[form.formState.errors.name]} />
              )}
            </Field>

            {/* Champ Photo URL */}
            <Field>
              <FieldLabel htmlFor="imageUrl">Photo du candidat *</FieldLabel>
              <Input
                id="imageUrl"
                type="text"
                placeholder="/candidates/jean-dupont.jpg"
                disabled={createCandidate.isPending}
                {...form.register("imageUrl")}
                aria-invalid={!!form.formState.errors.imageUrl}
              />
              <FieldDescription>
                Entrez le chemin de l'image dans le dossier public (ex: /candidates/photo.jpg)
              </FieldDescription>
              {form.formState.errors.imageUrl && (
                <FieldError errors={[form.formState.errors.imageUrl]} />
              )}
            </Field>

            {/* Aperçu de l'image
            {form.watch("imageUrl") && !form.formState.errors.imageUrl && (
              <div className="mt-2">
                <Label>Aperçu</Label>
                <div className="relative h-24 w-24 rounded-full bg-muted overflow-hidden mt-1 border">
                  <Image
                    src={form.watch("imageUrl")}
                    alt="Aperçu du candidat"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png"
                    }}
                  />
                </div>
              </div>
            )} */}

            {/* Champ Description */}
            <Field>
              <FieldLabel htmlFor="description">Description (optionnel)</FieldLabel>
              <Textarea
                id="description"
                placeholder="Présentation du candidat, son programme..."
                rows={3}
                disabled={createCandidate.isPending}
                {...form.register("description")}
                aria-invalid={!!form.formState.errors.description}
              />
              {form.formState.errors.description && (
                <FieldError errors={[form.formState.errors.description]} />
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                form.reset()
              }}
              disabled={createCandidate.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createCandidate.isPending}
            >
              {createCandidate.isPending ? "Ajout en cours..." : "Ajouter le candidat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}