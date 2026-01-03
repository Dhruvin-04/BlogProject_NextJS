"use client"

import { signUp } from '@/app/schemas/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const page = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(signUp),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit = (data: z.infer<typeof signUp>) => {
        startTransition(async () => {
            await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account created succesfully")
                        router.push('/')
                    },
                    onError: (error) => {
                        toast.error(error.error.message)
                    }
                }
            })
        })

    }

    return (
        <div>
            <Card>
                <CardHeader className='flex justify-between items-center'>
                    <div>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Sign up for an account</CardDescription>
                    </div>

                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className='gap-y-6'>
                            <Controller name='name' control={form.control} render={({ field, fieldState }) => (
                                <Field className='gap-y-2'>
                                    <FieldLabel>Full Name</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder='John Doe' {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name='email' control={form.control} render={({ field, fieldState }) => (
                                <Field className='gap-y-2'>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder='john@doe.com' type='email' {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name='password' control={form.control} render={({ field, fieldState }) => (
                                <Field className='gap-y-2'>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder='********' type='password' {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Button disabled={isPending}>{isPending?(
                                <>
                                    <Loader2 className='size-4 animate-spin' />
                                    <span>Loading...</span>
                                </>
                            ):(
                                <span>Sign Up</span>
                            )}</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default page