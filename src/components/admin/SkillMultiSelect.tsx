"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetSkillsQuery } from "@/redux/api/skillApi";

type SkillMultiSelectProps = {
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
};

export function SkillMultiSelect({
  value,
  onChange,
  placeholder = "Select technologies…",
}: SkillMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { data: skillsData, isLoading } = useGetSkillsQuery({
    page: 1,
    limit: 100,
  });

  const skills = skillsData?.data ?? [];
  const selectedSkills = skills.filter((skill) =>
    value.includes(skill._id || skill.id)
  );

  const toggleSkill = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((existing) => existing !== id) : [...value, id]
    );
  };

  const removeSkill = (id: string) => {
    onChange(value.filter((existing) => existing !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className="h-auto min-h-10 w-full items-start justify-between whitespace-normal px-3 py-2 font-normal"
        >
          <div className="flex flex-1 flex-wrap gap-1.5">
            {isLoading ? (
              <span className="text-sm text-muted-foreground">
                Loading skills…
              </span>
            ) : selectedSkills.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
            ) : (
              selectedSkills.map((skill) => {
                const id = skill._id || skill.id;
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="gap-1 pr-1 font-normal"
                  >
                    {skill.name}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${skill.name}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeSkill(id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          removeSkill(id);
                        }
                      }}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 self-center opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search skills…" />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading skills…
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {skills.length === 0
                    ? "No skills yet — add some on the Skills page first."
                    : "No matching skills."}
                </CommandEmpty>
                <CommandGroup>
                  {skills.map((skill) => {
                    const id = skill._id || skill.id;
                    const isSelected = value.includes(id);
                    return (
                      <CommandItem
                        key={id}
                        value={skill.name}
                        onSelect={() => toggleSkill(id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {skill.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
