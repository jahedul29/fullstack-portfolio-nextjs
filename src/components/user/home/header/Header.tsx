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

const Header = ({ ownerData, skills }: HeaderProps) => {
  const pitch =
    ownerData?.summery?.trim() ||
    ownerData?.aboutOwner?.split("\n")[0]?.trim();

  const topSkills = [...(skills || [])]
    .sort((a, b) => (b?.level ?? 0) - (a?.level ?? 0))
    .slice(0, 6);

  const categoryCount = new Set(
    (skills || []).map((skill) => skill.category).filter(Boolean)
  ).size;

  const stats: { value: string; label: string }[] = [];
  if (skills?.length) {
    stats.push({ value: `${skills.length}+`, label: "Skills" });
  }
  if (categoryCount > 1) {
    stats.push({ value: `${categoryCount}`, label: "Focus areas" });
  }

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
        {ownerData?.designation && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {ownerData.designation}
          </p>
        )}

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {ownerData?.name}
        </h1>

        {ownerData?.designation && (
          <p className="mt-3 text-lg font-semibold text-foreground md:text-xl">
            I work as a <span className="text-brand">{ownerData.designation}</span>.
          </p>
        )}

        {pitch && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            {pitch}
          </p>
        )}

        {topSkills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {topSkills.map((skill) => (
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
                Download Résumé
              </a>
            </Button>
          )}
        </div>

        {stats.length > 0 && (
          <div className="mt-12 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-extrabold text-foreground md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
