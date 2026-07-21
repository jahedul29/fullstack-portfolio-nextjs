"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FolderKanban,
  MessagesSquare,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectsQuery } from "@/redux/api/projectApi";
import { useGetSkillsQuery } from "@/redux/api/skillApi";
import { useGetBlogsQuery } from "@/redux/api/blogApi";
import { useGetExperiencesQuery } from "@/redux/api/experienceApi";
import { useGetContributionsQuery } from "@/redux/api/contributionApi";
import { useGetUsersQuery } from "@/redux/api/userApi";

type StatTile = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  total?: number;
  isLoading: boolean;
};

export default function DashboardPage() {
  const projects = useGetProjectsQuery({ page: 1, limit: 1 });
  const skills = useGetSkillsQuery({ page: 1, limit: 1 });
  const blogs = useGetBlogsQuery({ page: 1, limit: 1 });
  const experiences = useGetExperiencesQuery({ page: 1, limit: 1 });
  const contributions = useGetContributionsQuery({ page: 1, limit: 1 });
  const users = useGetUsersQuery({ page: 1, limit: 1 });

  const recentProjects = useGetProjectsQuery({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const tiles: StatTile[] = [
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
      total: projects.data?.meta?.total,
      isLoading: projects.isLoading,
    },
    {
      label: "Skills",
      href: "/admin/skills",
      icon: Sparkles,
      total: skills.data?.meta?.total,
      isLoading: skills.isLoading,
    },
    {
      label: "Blogs",
      href: "/admin/blogs",
      icon: Newspaper,
      total: blogs.data?.meta?.total,
      isLoading: blogs.isLoading,
    },
    {
      label: "Experiences",
      href: "/admin/experiences",
      icon: Briefcase,
      total: experiences.data?.meta?.total,
      isLoading: experiences.isLoading,
    },
    {
      label: "Contributions",
      href: "/admin/contributions",
      icon: MessagesSquare,
      total: contributions.data?.meta?.total,
      isLoading: contributions.isLoading,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      total: users.data?.meta?.total,
      isLoading: users.isLoading,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your portfolio content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="group block">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {tile.label}
                </CardTitle>
                <tile.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {tile.isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <div className="text-3xl font-semibold tracking-tight">
                    {tile.total ?? "—"}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent projects</CardTitle>
          <CardDescription>
            The latest projects added to your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentProjects.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : recentProjects.data?.data.length ? (
            <ul className="divide-y divide-border">
              {recentProjects.data.data.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {project.title}
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {project.category}
                    </p>
                  </div>
                  <Link
                    href="/admin/projects"
                    className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
