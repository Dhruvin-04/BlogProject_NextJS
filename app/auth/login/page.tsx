"use client"

import { login } from '@/app/schemas/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const page = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(login),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = (data: z.infer<typeof login>) => {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged in succesfully")
                        router.push('/')
                        router.refresh()
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
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Login to get started</CardDescription>
                    </div>

                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className='gap-y-6'>
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
                                <span>Login</span>
                            )}</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default page