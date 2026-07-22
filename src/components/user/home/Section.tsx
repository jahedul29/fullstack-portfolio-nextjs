import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  muted?: boolean;
  className?: string;
  children: ReactNode;
};

const Section = ({
  id,
  eyebrow,
  title,
  subtitle,
  muted = false,
  className,
  children,
}: SectionProps) => {
  const hasHeading = Boolean(eyebrow || title || subtitle);

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 border-t border-border/60 py-20 md:py-24",
        muted && "bg-muted/40",
        className
      )}
    >
      <div className="container mx-auto max-w-5xl px-6">
        {hasHeading && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
