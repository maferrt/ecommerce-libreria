import { AboutHero } from "@/components/about/AboutHero";
import { MissionVisionValues } from "@/components/about/MissionVisionValues";
import { TeamCarousel } from "@/components/about/TeamCarousel";

export default function NosotrosPage() {
  return (
    <>
      <AboutHero />
      <MissionVisionValues />
      <TeamCarousel />
    </>
  );
}