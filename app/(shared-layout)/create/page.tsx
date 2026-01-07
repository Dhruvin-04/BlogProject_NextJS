'use client'
import { createBlogAction } from '@/app/actions'
import { blogSchema } from '@/app/schemas/blogSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'


const page = () => {

    const [isPending, startTransition] = useTransition()

    const form = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: '',
            content: '',
            image: undefined
        }
    })

    const onSubmit = (data: z.infer<typeof blogSchema>) => {
        startTransition(async () => {
           await createBlogAction(data)
        })
    }

    return (
        <div className='w-full h-[80vh] max-w-2xl mx-auto flex flex-col justify-center'>
            <Card>
                <CardHeader className='text-center'>
                    <div>
                        <CardTitle className='text-4xl font-extrabold tracking-tight mb-1'>Create a Blog Article</CardTitle>
                        <CardDescription className='text-muted-foreground'>Enlighten the world with your thoughts</CardDescription>
                    </div>

                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className='gap-y-6'>
                            <Controller name='title' control={form.control} render={({ field, fieldState }) => (
                                <Field className='gap-y-2'>
                                    <FieldLabel>Title</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder='The day I started to believe' type='text' {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name='content' control={form.control} render={({ field, fieldState }) => (
                                <Field className='gap-y-2'>
                                    <FieldLabel>Content</FieldLabel>
                                    <Textarea className='h-30' aria-invalid={fieldState.invalid} placeholder='It was 31 dec 2025 ....' {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name='image' control={form.control} render={({ field, fieldState }) => (
                                <Field className='gap-y-2'>
                                    <FieldLabel>Image</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid}
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            field.onChange(file)
                                        }}

                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Button disabled={isPending}>{isPending ? (
                                <>
                                    <Loader2 className='size-4 animate-spin' />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Create</span>
                            )}</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default page