"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type FormProviderProps,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function Form<
  TFieldValues extends FieldValues,
>({ children, ...props }: FormProviderProps<TFieldValues>) {
  return <FormProvider {...props}>{children}</FormProvider>
}

type FormFieldContextValue = {
  name: FieldPath<FieldValues>
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)
const FormItemContext = React.createContext<{ id: string } | null>(null)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField must be used within a FormField")
  }

  if (!itemContext) {
    throw new Error("useFormField must be used within a FormItem")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  }
}

function FormItem({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentPropsWithoutRef<"label">) {
  const { formItemId } = useFormField()

  return (
    <label
      className={cn(
        "text-sm font-medium leading-none text-zinc-700 dark:text-zinc-200",
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentPropsWithoutRef<typeof Slot.Root>) {
  const { error, formItemId, formMessageId } = useFormField()

  return (
    <Slot.Root
      aria-describedby={error ? formMessageId : undefined}
      aria-invalid={Boolean(error)}
      id={formItemId}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
      id={formDescriptionId}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: React.ComponentPropsWithoutRef<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? error.message : children

  if (!body) {
    return null
  }

  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      id={formMessageId}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}