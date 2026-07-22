"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounced } from "@/hooks/common";
import { cn } from "@/lib/utils";
import { ISelectOptions } from "@/types";

const ALL_VALUE = "__all__";

type IFilterBarProps = {
  showSearch?: boolean;
  showSelect?: boolean;
  options?: ISelectOptions[];
  defaultSearchValue?: string;
  defaultSelectValue?: string;
  filterKey: string;
  queryParams?: { [key: string]: string | number | undefined };
  setQueryParams?: (query: { [key: string]: string | number } | any) => void;
  classNames?: string;
};

const Filterbar = ({
  showSearch = true,
  showSelect = true,
  options,
  defaultSearchValue,
  defaultSelectValue,
  filterKey = "",
  setQueryParams,
  classNames = "",
}: IFilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>(
    defaultSearchValue ?? ""
  );
  const [filter, setFilter] = useState<string>(defaultSelectValue ?? "");

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  useEffect(() => {
    if (setQueryParams) {
      setQueryParams((prev: { [key: string]: string | number }) => ({
        ...prev,
        searchTerm: debouncedTerm,
        [filterKey]: filter,
      }));
    }
  }, [debouncedTerm, setQueryParams, filter, filterKey]);

  return (
    <div className={cn("flex w-full gap-3 sm:w-1/2", classNames)}>
      {showSelect && (
        <Select
          value={filter === "" ? ALL_VALUE : filter}
          onValueChange={(value) =>
            setFilter(value === ALL_VALUE ? "" : value)
          }
        >
          <SelectTrigger className="bg-card sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem
                key={option.value || ALL_VALUE}
                value={option.value === "" ? ALL_VALUE : option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {showSearch && (
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-card pl-9"
            defaultValue={defaultSearchValue}
            placeholder="Search..."
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default Filterbar;
