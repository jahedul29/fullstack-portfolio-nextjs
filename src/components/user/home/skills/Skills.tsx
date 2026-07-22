import { Badge } from "@/components/ui/badge";
import Section from "@/components/user/home/Section";
import { ISkill, ISkillCategory } from "@/types";

type SkillGroup = {
  category: string;
  items: ISkill[];
};

const OTHER_CATEGORY = "Other";

const sortByPosition = (skills: ISkill[]): ISkill[] =>
  [...skills].sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));

const groupSkills = (
  skills: ISkill[],
  categories: ISkillCategory[]
): SkillGroup[] => {
  const bySkillCategoryName = new Map<string, ISkill[]>();
  const otherSkills: ISkill[] = [];

  (skills || []).forEach((skill) => {
    const category = skill?.category?.trim();
    if (!category) {
      otherSkills.push(skill);
      return;
    }
    const existing = bySkillCategoryName.get(category);
    if (existing) {
      existing.push(skill);
    } else {
      bySkillCategoryName.set(category, [skill]);
    }
  });

  const orderedCategories = [...(categories || [])].sort(
    (a, b) => (a?.position ?? 0) - (b?.position ?? 0)
  );

  const groups: SkillGroup[] = [];
  const usedCategoryNames = new Set<string>();

  orderedCategories.forEach((category) => {
    const items = bySkillCategoryName.get(category.name);
    if (items && items.length) {
      groups.push({ category: category.name, items: sortByPosition(items) });
      usedCategoryNames.add(category.name);
    }
  });

  bySkillCategoryName.forEach((items, categoryName) => {
    if (!usedCategoryNames.has(categoryName)) {
      otherSkills.push(...items);
    }
  });

  if (otherSkills.length) {
    groups.push({ category: OTHER_CATEGORY, items: sortByPosition(otherSkills) });
  }

  return groups;
};

const Skills = ({
  skills,
  categories = [],
  id = "",
}: {
  skills: ISkill[];
  categories?: ISkillCategory[];
  id?: string;
}) => {
  const groups = groupSkills(skills, categories);

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
