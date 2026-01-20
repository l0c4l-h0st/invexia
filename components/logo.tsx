import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <div className="relative w-8 h-8">
        <Image src="/logo.png" alt="Invexia Logo" fill className="object-contain" priority />
      </div>
      <span className="hidden sm:inline font-semibold text-lg text-foreground">Invexia</span>
    </Link>
  )
}
