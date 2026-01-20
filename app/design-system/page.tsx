import type { Metadata } from "next"
import { DesignSystemPage } from "@/components/design-system-page"

export const metadata: Metadata = {
  title: "Direction Artistique - Invexia",
  description: "Palette graphique et guide de style Invexia",
}

export default function Page() {
  return <DesignSystemPage />
}
