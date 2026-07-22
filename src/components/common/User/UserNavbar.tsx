"use client";

import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getSiteName } from "@/helpers/config/siteConfig";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { scroller } from "react-scroll";

export type UserNavbarSection = { key: string; visible: boolean };

type UserNavbarProps = {
  sections?: UserNavbarSection[];
  name?: string;
  resumeUrl?: string;
};

const NAV_ITEMS: Record<string, { id: string; title: string }> = {
  about: { id: "aboutMe", title: "About" },
  experience: { id: "experiences", title: "Experience" },
  projects: { id: "projects", title: "Projects" },
  sideProjects: { id: "side-projects", title: "Side Projects" },
  skills: { id: "skills", title: "Skills" },
  contributions: { id: "contributions", title: "Contributions" },
  blogs: { id: "blogs", title: "Blogs" },
  contact: { id: "contact", title: "Contact" },
};

const UserNavbar = ({ sections = [], name, resumeUrl }: UserNavbarProps) => {
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = sections
    .filter((section) => section.visible)
    .map((section) => NAV_ITEMS[section.key])
    .filter((item): item is { id: string; title: string } => !!item);

  const navIds = navItems.map((item) => item.id).join(",");

  useEffect(() => {
    if (!navIds) return;

    const elements = navIds
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [navIds]);

  const handleNavigate = (id: string) => {
    setMobileOpen(false);
    scroller.scrollTo(id, {
      duration: 500,
      delay: 30,
      smooth: "easeInOutCubic",
      offset: -80,
    });
  };

  const siteName = name || getSiteName();
  const trimmedResumeUrl = resumeUrl?.trim();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm text-lg font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand/70 text-sm font-extrabold text-brand-foreground">
            {siteName.slice(0, 2).toUpperCase()}
          </span>
          {siteName}
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                handleNavigate(item.id);
              }}
              aria-current={activeId === item.id ? "true" : undefined}
              className={cn(
                "rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeId === item.id && "text-foreground"
              )}
            >
              {item.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {trimmedResumeUrl && (
            <Button
              asChild
              size="sm"
              className="hidden bg-brand text-brand-foreground hover:bg-brand/90 md:inline-flex"
            >
              <a href={trimmedResumeUrl} target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          )}

          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-6">
                <nav
                  className="mt-6 flex flex-col gap-4"
                  aria-label="Mobile primary"
                >
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`/#${item.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavigate(item.id);
                      }}
                      aria-current={activeId === item.id ? "true" : undefined}
                      className={cn(
                        "rounded-sm text-base font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        activeId === item.id && "text-foreground"
                      )}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
                {trimmedResumeUrl && (
                  <Button
                    asChild
                    className="bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <a
                      href={trimmedResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resume
                    </a>
                  </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
