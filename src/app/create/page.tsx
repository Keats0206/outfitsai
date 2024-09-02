import { redirect } from 'next/navigation'
import OutfitGenerator from './components/OutfitGenerator'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Create() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <OutfitGenerator user={user} />
}