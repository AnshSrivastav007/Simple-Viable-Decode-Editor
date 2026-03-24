import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SLC - Code Editor',
  description: 'Simple Viable Decode Editor - Online Code Editor with Auto Language Updates',
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
