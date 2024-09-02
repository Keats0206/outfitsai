'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ImageOverlay from "../components/ImageOverlay";

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/create')
      }
    }
    checkUser()
  }, [supabase, router])

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <section className="gap-16 flex sm:flex-row flex-col w-full px-8 py-24">
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-6xl font-bold mb-4">Never Wonder What To Wear Again</h1>
          <h2 className="text-2xl mb-6">Generate infinite and personalized outfit ideas using AI</h2>
          <Button asChild className='w-48'>
            <Link href="/login">Start Creating</Link>
          </Button>
        </div>
        <div className='flex justify-center w-full md:w-1/2'>
          <ImageOverlay />
        </div>
      </section>
      <section className="p-8 items-center py-24 bg-white w-full grid grid-cols-3 gap-8 mb-16">
      {[
      {
        icon: '🎨',
        title: 'Personalize Your Style',
        detail: 'Define your unique fashion preferences through our intuitive interface. Specify colors, patterns, occasions, and more to create your perfect look.'
      },
      {
        icon: '🤖',
        title: 'AI-Powered Generation',
        detail: 'Our advanced AI algorithms analyze your inputs and current fashion trends to generate custom outfit combinations tailored specifically to your taste.'
      },
      {
        icon: '👚',
        title: 'Elevate Your Wardrobe',
        detail: 'Bring your virtual outfits to life. Use our suggestions to shop smartly or mix and match with your existing wardrobe for a refreshed, stylish appearance.'
      },
    ].map((step, index) => (
      <div key={index}>
        <div className="text-6xl mb-4">{step.icon}</div>
        <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
        <p className='text-gray-600 leading-relaxed'>{step.detail}</p>
      </div>
    ))}
      </section>
      <section className="p-8 gap-12 flex justify-between w-full">
        <div className="border h-96 w-full p-8 rounded">
          <h3 className="font-bold mb-2 text-2xl">Why not free?</h3>
          <p>AI costs money to run and maintain.</p>
        </div>
        <div className="border w-full h-96 p-4 rounded">
          <h3 className="font-bold mb-2 text-2xl">Pricing</h3>
          <p>$15/month for unlimited generations</p>
        </div>
      </section>
      <footer className='flex items-center px-8 w-full h-16 bg-black text-stone-700'>
        Built with love by Pete 
      </footer>
    </div>
  )
}