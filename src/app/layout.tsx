import Nav from '../components/Nav'
import './globals.css'

export const metadata = {
  title: 'OUTFITAI',
  description: 'AI Style Inspiration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}