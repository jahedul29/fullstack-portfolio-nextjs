import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Section from "@/components/user/home/Section";
import { orderByPosition } from "@/lib/sort-skills";
import { IExperience, ISkill } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormatter.format(date);
};

const formatRange = (startTime?: string, endTime?: string) => {
  const start = formatDate(startTime);
  const end = endTime ? formatDate(endTime) : "Present";
  return [start, end].filter(Boolean).join(" — ");
};

const Experience = ({
  experiences,
  id = "",
}: {
  experiences: IExperience[];
  id?: string;
}) => {
  return (
    <Section
      id={id}
      eyebrow="Experience"
      title="Where I've had impact"
      subtitle="Roles framed by outcomes and scope — not just a tech list."
      muted
    >
      <div className="flex flex-col gap-5">
        {experiences?.map((experience) => {
          const scopeParts = [
            experience.role,
            experience.teamSize ? `Team of ${experience.teamSize}` : undefined,
          ].filter(Boolean);

          return (
            <div
              key={experience.id}
              className="grid gap-3 sm:grid-cols-[150px_1fr] sm:gap-6"
            >
              <div className="text-sm text-muted-foreground sm:pt-1 sm:text-right">
                <p>{formatRange(experience.startTime, experience.endTime)}</p>
                <p className="mt-1 text-foreground">{experience.companyName}</p>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground">
                  {experience.position}
                </h3>
                <p className="mt-1 text-sm font-semibold text-brand">
                  {experience.companyName}
                  {scopeParts.length > 0 ? ` · ${scopeParts.join(" · ")}` : ""}
                </p>

                {experience.description && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {experience.description}
                  </p>
                )}

                {experience.impact && experience.impact.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {experience.impact.map((line, index) => (
                      <li
                        key={index}
                        className="relative pl-4 text-sm text-muted-foreground before:absolute before:left-0 before:text-brand before:content-['▸']"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                )}

                {experience.metrics && experience.metrics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {experience.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-muted/40 px-3 py-2"
                      >
                        <div className="text-base font-extrabold text-brand">
                          {metric.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {experience.technologies && experience.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {orderByPosition(experience.technologies).map((skill: ISkill, index: number) => (
                      <Badge key={(skill._id || skill.id) + index} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default Experience;
