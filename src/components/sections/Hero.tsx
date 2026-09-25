"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { SceneView } from "@/components/three/SceneView";
import { HeroGlobe } from "@/components/three/HeroGlobe";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ANCHORS } from "@/lib/constants";
import { useExperience } from "@/components/providers/ExperienceProvider";

export function Hero() {
  const { device } = useExperience();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden"
    >
      {/* Radial darkening so text stays legible over the 3D layer. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(10,10,11,0.2)_0%,rgba(10,10,11,0.85)_75%)]" />

      {/* 3D layer: a slow, dark globe. */}
      <SceneView className="z-[2]">
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#FFA726" />
        <pointLight position={[-4, -2, 2]} intensity={2} color="#E03E00" />
        <HeroGlobe pointCount={device.tier === "low" ? 120 : 260} />
        {/* No EffectComposer here: post-processing hijacks the shared canvas
            that drei Views composite into, blanking the hero's 3D layer on
            desktop tiers. The emissive materials read as glowing without it. */}
      </SceneView>

      {/* Static gradient fallback shown when 3D is off (reduced motion). */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_60%,rgba(224,62,0,0.25)_0%,transparent_55%)]" />

      {/* Foreground content. */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center sm:px-8">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/5 px-4 py-1.5 text-xs font-medium tracking-wide text-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-spark" />
          {/* PLACEHOLDER — verify before publishing */}
          ~1,200 people groups still have no Scripture
          <span className="text-textMuted/60">[verify]</span>
        </span>

        <SplitHeading
          as="h1"
          trigger="mount"
          className="font-display text-[3.25rem] font-black leading-[1.05] tracking-tight text-textPrimary sm:text-7xl lg:text-8xl"
        >
          <span className="block">Every language.</span>
          <span className="block">One flame.</span>
        </SplitHeading>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-textMuted sm:text-xl">
          The gospel is spreading to every tribe and tongue — and your church
          can carry the fire to one still waiting.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={`#${ANCHORS.sponsor}`} variant="primary">
            Sponsor a language community
          </Button>
          <Button href={`#${ANCHORS.howItWorks}`} variant="ghost">
            See how it works
          </Button>
        </div>
      </div>

      {/* Scroll indicator. */}
      <a
        href={`#${ANCHORS.vision}`}
        aria-label="Scroll to explore"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-textMuted transition-colors hover:text-spark"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-current p-1">
          <span className="h-2 w-0.5 animate-bounce rounded-full bg-current" />
        </span>
      </a>
    </section>
  );
}
