"use client";

import { useDebounced } from "@/hooks/common";
import { ISelectOptions } from "@/types";
import { Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

type IFilterBarProps = {
  showSearch?: boolean;
  showSelect?: boolean;
  options?: ISelectOptions[];
  defaultSearchValue?: string;
  defaultSelectValue?: string;
  filterKey: string;
  queryParams?: { [key: string]: string | number | undefined };
  setQueryParams?: (query: { [key: string]: string | number } | any) => void;
  allowSelectClear?: boolean;
  classNames?: string;
};

const Filterbar = ({
  showSearch = true,
  showSelect = true,
  options,
  defaultSearchValue,
  defaultSelectValue,
  filterKey = "",
  queryParams,
  setQueryParams,
  allowSelectClear = false,
  classNames = "",
}: IFilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const handleSelectChange = (value: string) => {
    setFilter(value);
  };
  const router = useRouter();

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
  }, [debouncedTerm, searchTerm, setQueryParams, filter, filterKey]);

  return (
    <div className={`flex gap-x-4 w-1/2 ${classNames}`}>
      {showSelect && (
        <Select
          allowClear={allowSelectClear}
          style={{ width: "100%", height: "fit-content" }}
          size="large"
          placeholder="Please select"
          value={defaultSelectValue}
          onChange={handleSelectChange}
          options={options}
          className="shadow-lg"
        />
      )}
      {showSearch && (
        <Input
          size="large"
          value={defaultSearchValue}
          addonAfter={<IoSearch className="text-white font-medium text-xl" />}
          placeholder="large size"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
    </div>
  );
};

export default Filterbar;
