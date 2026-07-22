import { ISkill } from "@/types";

export const orderByPosition = (skills?: ISkill[]): ISkill[] => {
  if (!skills) return [];
  return [...skills].sort(
    (a, b) => (a?.position ?? 0) - (b?.position ?? 0)
  );
};
