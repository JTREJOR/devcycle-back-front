import type { ComponentProps } from "react";
import { Label } from "@vibe/core";

type LabelColor = ComponentProps<typeof Label>["color"];

const ROLE_COLORS: LabelColor[] = [
  "dark_purple",
  "indigo",
  "teal",
  "dark-orange",
  "berry",
  "royal",
  "brown",
  "steel",
  "chili-blue",
  "lipstick",
];

function hashToIndex(value: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1000;
  }
  return hash % mod;
}

export function RoleTag({ roleId, roleName }: { roleId: string; roleName: string }) {
  const color = ROLE_COLORS[hashToIndex(roleId, ROLE_COLORS.length)];
  return <Label text={roleName} color={color} kind="line" size="small" />;
}
