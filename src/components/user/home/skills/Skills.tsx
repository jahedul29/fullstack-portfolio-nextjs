import { Badge } from "@/components/ui/badge";
import Section from "@/components/user/home/Section";
import { ISkill } from "@/types";

type SkillGroup = {
  category: string;
  items: ISkill[];
};

const OTHER_CATEGORY = "Other";

const groupSkills = (skills: ISkill[]): SkillGroup[] => {
  const groups = new Map<string, ISkill[]>();

  (skills || []).forEach((skill) => {
    const category = skill?.category?.trim() || OTHER_CATEGORY;
    const existing = groups.get(category) ?? [];
    existing.push(skill);
    groups.set(category, existing);
  });

  return Array.from(groups.entries())
    .map(([category, items]) => ({
      category,
      items: [...items].sort((a, b) => (b?.level ?? 0) - (a?.level ?? 0)),
    }))
    .sort((a, b) => {
      if (a.category === OTHER_CATEGORY) return 1;
      if (b.category === OTHER_CATEGORY) return -1;
      return a.category.localeCompare(b.category);
    });
};

const Skills = ({ skills, id = "" }: { skills: ISkill[]; id?: string }) => {
  const groups = groupSkills(skills);

  return (
    <Section
      id={id}
      eyebrow="Skills"
      title="Tools I reach for"
      subtitle="Grouped by area — no self-rated percentage bars."
      muted
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <Badge
                  key={skill._id || skill.id}
                  variant="outline"
                  className="border-border bg-card text-muted-foreground"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
