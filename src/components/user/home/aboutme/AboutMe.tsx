import Section from "@/components/user/home/Section";
import { IOwner } from "@/types";
import Image from "next/image";

type QuickFact = {
  label: string;
  value?: string;
};

const AboutMe = ({
  ownerData,
  id = "",
}: {
  ownerData: IOwner;
  id?: string;
}) => {
  const paragraphs =
    ownerData?.aboutOwner?.split("\n").filter((line) => line.trim().length > 0) ??
    [];

  const quickFacts: QuickFact[] = [
    { label: "Location", value: ownerData?.address },
    { label: "Focus", value: ownerData?.designation },
  ].filter((fact) => Boolean(fact.value));

  return (
    <Section id={id}>
      <div className="grid gap-11 md:grid-cols-[1.4fr_0.9fr] md:items-start">
        <div className="space-y-4">
          <div className="mb-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              About
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              A bit about me
            </h2>
          </div>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <div>
          {ownerData?.photoUrl && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted/40">
              <Image
                alt={`${ownerData?.name} portrait`}
                src={ownerData.photoUrl}
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          {quickFacts.length > 0 && (
            <div className="mt-5 flex flex-col gap-2.5">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="flex gap-3 text-sm">
                  <span className="min-w-[84px] font-semibold text-brand">
                    {fact.label}
                  </span>
                  <span className="text-muted-foreground">{fact.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default AboutMe;
