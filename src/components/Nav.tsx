'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

export default function Nav() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">OutfitsAI</span>
      </Link>
      <div className="space-x-4">
        {user ? (
          <div className='flex flex-row space-x-2'>
            <Link href="/history" className="flex items-center space-x-2">
              <span>History</span>
            </Link>
            <Link href="/create" className="flex items-center space-x-2">
              <span>Create</span>
            </Link>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        ) : (
          pathname !== '/login' && (
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          )
        )}
      </div>
    </nav>
  )
}