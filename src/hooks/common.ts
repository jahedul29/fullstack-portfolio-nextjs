import { useEffect, useState } from "react";

interface IDebounceProps {
  searchQuery: string;
  delay: number;
}

export const useDebounced = ({ searchQuery, delay }: IDebounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchQuery);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);

  return debouncedValue;
};
