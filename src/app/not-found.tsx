'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    const pathname = usePathname()

    useEffect(() => {
        console.error('404 Error: User attempted to access non-existent route:', pathname)
    }, [pathname])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">404</h1>
                <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
                <Button className='hover:bg-blue-500'>
                    <Link href="/feed" className=" underline text-white">
                        Return to Feed
                    </Link>
                </Button>

            </div>
        </div>
    )
}
