import { Geist, Geist_Mono, Inter, Source_Code_Pro } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})
const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code-pro',
  subsets: ['latin'],
})
export const fontClass = [geistSans, geistMono, inter, sourceCodePro].map((f) => f.variable).join(' ')
