"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { format } from "date-fns"

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
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email:
        z.string().email("Enter a valid email address."),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters."),
    username: z
        .string()
        .min(2, "Username must be at least 2 characters."),
    date_of_birth: z.date({ message: "Date of birth is required." }),
})

const SignUp = () =>  {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
            date_of_birth: undefined as unknown as Date,
        },
    })

    const [submitting, setSubmitting] = React.useState(false);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setSubmitting(true);
            const dob = data.date_of_birth ?
                new Date(data.date_of_birth).toISOString().slice(0,10) : undefined;

            const res = await apiFetch<{ success: boolean; message?: string }>(
                "/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: data.email,
                        username: data.username,
                        password: data.password,
                        date_of_birth: dob,
                    }),
                }
            );

            if (res?.success) {
                toast.success("Registration successful. Please check your email for verification if required.");
                router.push("/signin");
            }
        } catch (err: any) {
            const payload = err?.payload;
            if (payload?.details && Array.isArray(payload.details)) {
                payload.details.forEach((e: any) => {
                    const field = (e.field as keyof z.infer<typeof formSchema>) || undefined;
                    if (field) {
                        // @ts-ignore
                        form.setError(field, { message: e.message });
                    }
                });
            }
            // Single-field unique errors
            if (payload?.field && payload?.error) {
                const field = payload.field as keyof z.infer<typeof formSchema>;
                // @ts-ignore
                form.setError(field, { message: payload.error });
            }
            toast.error(payload?.error || err.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Sign Up
                </CardTitle>
                <CardDescription className="text-center text-sm">
                   Create an Account to get started with ArtFlowers.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email">
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
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="username">
                                        Username
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="username"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your username"
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
                        <Controller
                            name="date_of_birth"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="date_of_birth">
                                        Date of Birth
                                    </FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Input
                                                id="date_of_birth"
                                                readOnly
                                                value={field.value ? format(field.value, "PPP") : ""}
                                                placeholder="Select your date of birth"
                                                aria-invalid={fieldState.invalid}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => field.onChange(date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                    <Button type="submit" form="signup-form" disabled={submitting}>
                        Sign Up
                    </Button>
                </Field>
                <p className="text-sm text-center mt-2">
                    Have an account?{" "}
                    <Link href="/signin" className="font-medium underline">
                        Sign In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
export default SignUp
