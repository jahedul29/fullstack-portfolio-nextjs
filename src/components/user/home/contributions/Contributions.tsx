import { FaGithub, FaLink } from "react-icons/fa";

import ContentCard, {
  ContentCardLink,
} from "@/components/user/home/ContentCard";
import Section from "@/components/user/home/Section";
import { orderByPosition } from "@/lib/sort-skills";
import { IContribution } from "@/types";

const buildContributionLinks = (
  contribution: IContribution
): ContentCardLink[] => {
  const links: ContentCardLink[] = [];
  if (contribution?.githubUrl) {
    links.push({
      href: contribution.githubUrl,
      label: "GitHub",
      icon: <FaGithub />,
    });
  }
  if (contribution?.relatedUrl) {
    links.push({
      href: contribution.relatedUrl,
      label: "Related link",
      icon: <FaLink />,
    });
  }
  return links;
};

const Contributions = ({
  contributions,
  id = "",
}: {
  contributions: IContribution[];
  id?: string;
}) => {
  return (
    <Section
      id={id}
      eyebrow="Contributions"
      title="Community & open source"
      subtitle="Work outside the day job — where I've helped other projects ship."
      muted
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contributions?.map((contribution) => (
          <ContentCard
            key={contribution.id}
            title={contribution.title}
            imageUrl={contribution.photoUrl}
            imageAlt={`${contribution.title} preview`}
            eyebrow={contribution.contributionFor}
            description={contribution.description}
            tags={orderByPosition(contribution.technologies).map((skill) => skill.name)}
            links={buildContributionLinks(contribution)}
          />
        ))}
      </div>
    </Section>
  );
};

export default Contributions;
