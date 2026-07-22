import { ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ContentCardLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

type ContentCardProps = {
  title: string;
  imageUrl?: string;
  imageAlt: string;
  eyebrow?: string;
  roleLabel?: string;
  description?: string;
  tags?: string[];
  links?: ContentCardLink[];
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

const ContentCard = ({
  title,
  imageUrl,
  imageAlt,
  eyebrow,
  roleLabel,
  description,
  tags,
  links,
  ctaHref,
  ctaLabel,
  className,
}: ContentCardProps) => {
  const hasFooter = Boolean((links && links.length > 0) || (ctaHref && ctaLabel));

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-brand/60",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted/40">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-6">
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand">
            {eyebrow}
          </p>
        )}

        <h3 className="text-lg font-bold text-foreground">{title}</h3>

        {roleLabel && (
          <p className="mt-1 text-sm font-semibold text-brand">{roleLabel}</p>
        )}

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {hasFooter && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            {links && links.length > 0 && (
              <div className="flex items-center gap-4 text-muted-foreground">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="text-lg transition-colors hover:text-brand"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}

            {ctaHref && ctaLabel && (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ctaLabel}
                title={ctaLabel}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                {ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentCard;
