"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  loginCredentialsSchema,
  type LoginCredentials,
} from "@src/auth/domain/login"
import { loginAction } from "@src/auth/interfaces/login-action"

type LoginFormValues = LoginCredentials

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginCredentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    form.clearErrors()

    const result = await loginAction(values)

    if (result?.ok === false) {
      form.setError("password", {
        type: "server",
        message: result.error,
      })
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.35)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Sign in
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Access your training management account.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      autoComplete="email"
                      className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40"
                      placeholder="name@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      autoComplete="current-password"
                      className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40"
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="h-11 w-full rounded-lg"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </div>
      </form>
    </Form>
  )
}