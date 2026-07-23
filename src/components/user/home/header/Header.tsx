"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOwner, ISkill } from "@/types";
import { scroller } from "react-scroll";

type HeaderProps = {
  ownerData: IOwner;
  skills: ISkill[];
};

const scrollToSection = (id: string) => {
  scroller.scrollTo(id, {
    duration: 500,
    delay: 30,
    smooth: "easeInOutCubic",
    offset: -80,
  });
};

const splitOnHighlight = (text: string, highlight?: string) => {
  const trimmedHighlight = highlight?.trim();
  if (!trimmedHighlight) {
    return null;
  }

  const index = text.indexOf(trimmedHighlight);
  if (index === -1) {
    return null;
  }

  return {
    before: text.slice(0, index),
    highlight: text.slice(index, index + trimmedHighlight.length),
    after: text.slice(index + trimmedHighlight.length),
  };
};

const Header = ({ ownerData, skills }: HeaderProps) => {
  const pitch =
    ownerData?.summery?.trim() ||
    ownerData?.aboutOwner?.split("\n")[0]?.trim();

  const eyebrow = [
    ownerData?.designation,
    ownerData?.yearsOfExperience
      ? `${ownerData.yearsOfExperience}+ years`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const heroTagline = ownerData?.heroTagline?.trim();
  const taglineHighlight = heroTagline
    ? splitOnHighlight(heroTagline, ownerData?.heroHighlight)
    : null;

  const skillById = new Map(
    (skills || []).map((skill) => [skill._id || skill.id, skill])
  );
  const sortByPosition = (list: ISkill[]) =>
    [...list].sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));

  const heroSkills = ownerData?.heroSkills?.length
    ? sortByPosition(
        ownerData.heroSkills
          .map((id) => skillById.get(id))
          .filter(Boolean) as ISkill[]
      )
    : sortByPosition(skills || []).slice(0, 6);

  return (
    <header className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 15% 0%, hsl(var(--brand) / 0.18), transparent 70%), radial-gradient(50% 50% at 90% 10%, hsl(var(--brand) / 0.14), transparent 70%)",
        }}
      />

      <div className="container relative mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-32">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {eyebrow}
          </p>
        )}

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {ownerData?.name}
        </h1>

        {heroTagline ? (
          <p className="mt-3 text-lg font-semibold text-foreground md:text-xl">
            {taglineHighlight ? (
              <>
                {taglineHighlight.before}
                <span className="text-brand">{taglineHighlight.highlight}</span>
                {taglineHighlight.after}
              </>
            ) : (
              heroTagline
            )}
          </p>
        ) : (
          ownerData?.designation && (
            <p className="mt-3 text-lg font-semibold text-foreground md:text-xl">
              I work as a <span className="text-brand">{ownerData.designation}</span>.
            </p>
          )
        )}

        {pitch && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            {pitch}
          </p>
        )}

        {heroSkills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {heroSkills.map((skill) => (
              <Badge
                key={skill._id}
                variant="outline"
                className="border-brand/30 text-brand"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => scrollToSection("projects")}
          >
            View Work →
          </Button>
          <Button variant="outline" onClick={() => scrollToSection("contact")}>
            Get in touch
          </Button>
          {ownerData?.resumeUrl && (
            <Button variant="outline" asChild>
              <a
                href={ownerData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume
              </a>
            </Button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
