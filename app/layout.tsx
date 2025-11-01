import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Scraper',
  description: 'Minimalistic web scraping tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
