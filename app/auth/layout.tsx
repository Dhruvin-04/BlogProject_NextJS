import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const layout = ({children}:{children: ReactNode}) => {
  return (
    <div className='h-screen flex justify-center items-center'>
        <div className='absolute top-5 left-5'>
            <Link href='/' className={buttonVariants({variant: 'secondary'})}>
                <ArrowLeft className='size-4' />
                Go Back
            </Link>
        </div>
        <div className='w-full mx-auto max-w-lg'>
            {children}
        </div>
    </div>
  )
}

export default layout