"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { apiFetch, setTokens } from "@/lib/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email:
        z.string().email("Enter a valid email address."),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters.")
})

const SignIn = () =>  {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const [submitting, setSubmitting] = React.useState(false);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setSubmitting(true);
            const res = await apiFetch<{
                success: boolean;
                data?: { accessToken: string; refreshToken?: string; user?: any };
            }>(
                "/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                    }),
                }
            );

            if (res?.success && res.data?.accessToken) {
                setTokens(res.data.accessToken, res.data.refreshToken);
                toast.success("Signed in successfully");
                router.push("/profile");
            }
        } catch (err: any) {
            const payload = err?.payload;
            if (payload?.error?.toLowerCase().includes("email")) {
                // @ts-ignore
                form.setError("email", { message: payload.error });
            } else if (payload?.error?.toLowerCase().includes("password")) {
                // @ts-ignore
                form.setError("password", { message: payload.error });
            }
            toast.error(payload?.error || err.message || "Sign in failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Sign In
                </CardTitle>
                <CardDescription className="text-center text-sm">
                    Sign in to your account to continue.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="login" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your email address"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your password"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2">
                <Field orientation="horizontal">
                    <Button type="submit" form="login" disabled={submitting}>
                        Sign In
                    </Button>
                </Field>
                <p className="text-sm text-center mt-2">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-medium underline">
                        Sign Up
                    </Link>

                </p>
            </CardFooter>
        </Card>
    )
}
export default SignIn
