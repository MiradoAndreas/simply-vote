"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { format } from "date-fns";
import { z } from "zod"
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { fr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const formSchema = z
  .object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    maxChoices: z.number().min(1, "Le nombre maximum de choix doit être au moins 1"),
    isPublic: z.boolean(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  })
  .refine((data) => data.startDate >= new Date(), {
    message: "La date de début ne peut pas être dans le passé",
    path: ["startDate"],
  });

type FormValues = z.infer<typeof formSchema>;

export const CreateElectionForm = () => {
  const trpc = useTRPC()
  const router = useRouter()



  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      maxChoices: 1,
      isPublic: true,
    },
  })

  const createElection = useMutation(
    trpc.election.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Élection créée avec succès")
      },
      onError: (error) => {
        toast.error(error.message)
        console.error(error)
      }
    })
  )

  const onSubmit = (values: FormValues) => {
    console.log("VALUES DE LA FORMULAIRE : ", values)

    createElection.mutate(values)
  }

  return (
    <div>


      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Titre */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Titre *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Ex: Élection 2024"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Description..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Date de début *</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        {field.value ? format(field.value, "PPP", { locale: fr }) : "Choisir"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Date de fin *</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        {field.value ? format(field.value, "PPP", { locale: fr }) : "Choisir"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < form.getValues("startDate")}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Nombre maximum de choix */}
          <Controller
            name="maxChoices"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Nombre maximum de choix</FieldLabel>
                  <FieldDescription>1 = vote unique</FieldDescription>
                </FieldContent>
                <Input
                  type="number"
                  min={1}
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Élection publique */}
          <Controller
            name="isPublic"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="border p-4 rounded-lg"
              >
                <FieldContent>
                  <FieldLabel>Élection publique</FieldLabel>
                  <FieldDescription>
                    Accessible à tous les utilisateurs
                  </FieldDescription>
                </FieldContent>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createElection.isPending}
              className="flex-1"
            >
              {createElection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

