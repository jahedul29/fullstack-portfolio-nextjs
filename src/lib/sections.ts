import {
  DEFAULT_SECTIONS,
  SECTION_KEYS,
  Section,
} from "@/server/modules/owner/owner.constant";

type LegacySections = Record<string, unknown>;

const isPlainObject = (value: unknown): value is LegacySections =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const cloneDefaults = (): Section[] =>
  DEFAULT_SECTIONS.map((section) => ({ ...section }));

const isKnownKey = (key: unknown): key is string =>
  typeof key === "string" &&
  (SECTION_KEYS as readonly string[]).includes(key);

export const normalizeSections = (raw: unknown): Section[] => {
  if (raw === undefined || raw === null) {
    return cloneDefaults();
  }

  if (Array.isArray(raw)) {
    const known = new Map<string, Section>();
    raw
      .filter(
        (item): item is { key: unknown; visible?: unknown } =>
          isPlainObject(item) && isKnownKey(item.key)
      )
      .forEach((item) => {
        const key = item.key as string;
        if (!known.has(key)) {
          known.set(key, { key, visible: item.visible !== false });
        }
      });

    const presentKeys = new Set(known.keys());
    const missing = SECTION_KEYS.filter((key) => !presentKeys.has(key)).map(
      (key) => ({ key, visible: true })
    );

    return [...known.values(), ...missing];
  }

  if (isPlainObject(raw)) {
    return DEFAULT_SECTIONS.map(({ key }) => ({
      key,
      visible: raw[key] !== false,
    }));
  }

  return cloneDefaults();
};
