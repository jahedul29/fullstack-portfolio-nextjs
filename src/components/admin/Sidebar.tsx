"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Newspaper,
  Briefcase,
  UserCircle,
  MessagesSquare,
  Users,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { href: "/admin/owner", label: "Owner", icon: UserCircle },
  { href: "/admin/contributions", label: "Contributions", icon: MessagesSquare },
  { href: "/admin/users", label: "Users", icon: Users },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ collapsed, onToggle, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-3">
        {!collapsed && (
          <Link
            href="/admin/dashboard"
            className="truncate px-1 text-lg font-semibold tracking-tight text-foreground"
          >
            Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
