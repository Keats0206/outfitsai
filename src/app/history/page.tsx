'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { Heart, Download } from 'lucide-react'

export default function Home() {
  const [outfits, setOutfits] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    async function fetchOutfits() {
      if (!user) return

      const { data, error } = await supabase
        .from('outfit_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)
      
      if (error) {
        console.error('Error fetching outfits:', error)
      } else {
        setOutfits(data || [])
      }
    }

    fetchOutfits()
  }, [supabase, user])

  if (!user) return <div className='w-screen min-h-screen flex items-center justify-center'>Loading...</div>

  return (
    <div className='flex flex-col'>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="flex flex-col relative group">
            <Image 
              src={outfit.image_url} 
              alt={outfit.prompt} 
              width={600} 
              height={600} 
              className="w-full h-auto object-cover rounded-lg shadow-md transition-transform"
            />
            <div className="absolute inset-2 bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end justify-between opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Heart className="text-white cursor-pointer" size={32} />
                <Download className="text-white cursor-pointer" size={32} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}