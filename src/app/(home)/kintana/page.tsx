import { CEOSectionCircle } from "@/components/ceo-section-circle"
import { KintanaHeroCarousel } from "@/components/kintana-carousel"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kintana"
}


const Page = () => {
  return (
    <div className="">

      <KintanaHeroCarousel />
      <CEOSectionCircle
        name="Geneto Robson"
        title="Fondateur de Simply Vote & Président de l'AEPC 2025"
        message="L’idée est née d’un constat simple : de nombreux étudiants ne peuvent pas participer aux élections en raison de contraintes de déplacement ou d’organisation. Cette situation limite la participation et affecte la représentativité."
        imageSrc="/kintana/ceo.jpg"
      />
    </div>
  )
}

export default Page