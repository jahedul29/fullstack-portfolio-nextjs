import { FaGithub, FaLink, FaYoutube } from "react-icons/fa";

import ContentCard, {
  ContentCardLink,
} from "@/components/user/home/ContentCard";
import Section from "@/components/user/home/Section";
import { orderByPosition } from "@/lib/sort-skills";
import { IProject } from "@/types";

const buildProjectLinks = (project: IProject): ContentCardLink[] => {
  const links: ContentCardLink[] = [];
  if (project?.githubUrl) {
    links.push({
      href: project.githubUrl,
      label: "GitHub",
      icon: <FaGithub />,
    });
  }
  if (project?.websiteUrl) {
    links.push({ href: project.websiteUrl, label: "Live site", icon: <FaLink /> });
  }
  if (project?.videoUrl) {
    links.push({
      href: project.videoUrl,
      label: "Video walkthrough",
      icon: <FaYoutube />,
    });
  }
  return links;
};

const SideProjects = ({
  projects,
  id = "",
}: {
  projects: IProject[];
  id?: string;
}) => {
  const personalProjects = projects?.filter(
    (project) => project.type === "personal"
  );

  if (!personalProjects || personalProjects.length === 0) {
    return null;
  }

  return (
    <Section
      id={id}
      eyebrow="Side Projects"
      title="Side Projects"
      subtitle="Smaller builds and experiments outside of client and full-time work."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {personalProjects.map((project) => (
          <ContentCard
            key={project.id}
            title={project.title}
            imageUrl={project.photoUrl}
            imageAlt={`${project.title} preview`}
            featured={project.isFeatured}
            roleLabel={project.role}
            typeBadge={{ label: "Side project", tone: "muted" }}
            description={project.outcome || project.description}
            tags={orderByPosition(project.technologies).map((skill) => skill.name)}
            links={buildProjectLinks(project)}
          />
        ))}
      </div>
    </Section>
  );
};

export default SideProjects;
