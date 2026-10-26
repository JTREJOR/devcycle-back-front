"use client";

import { useMemo } from "react";
import { Avatar, Dropdown, Icon } from "@vibe/core";
import { Labs } from "@vibe/icons";
import { useRoles, useUsers } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";

interface UserOption {
  value: string;
  label: string;
  roleName: string;
  avatarColor: string;
  [key: string]: unknown;
}

export function RoleSwitcher() {
  const { data: users = [] } = useUsers();
  const { data: roles = [] } = useRoles();
  const activeUserId = useUiStore((s) => s.activeUserId);
  const setActiveUserId = useUiStore((s) => s.setActiveUserId);

  const options: UserOption[] = useMemo(
    () =>
      users.map((user) => ({
        value: user.id,
        label: user.name,
        roleName: roles.find((r) => r.id === user.roleId)?.name ?? user.roleId,
        avatarColor: user.avatarColor,
      })),
    [users, roles],
  );

  const activeOption = options.find((o) => o.value === activeUserId) ?? null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-brand-primary">
        <Icon icon={Labs} size={16} />
      </div>
      {activeOption && (
        <Avatar
          size="small"
          type="text"
          text={activeOption.label.slice(0, 1)}
          customBackgroundColor={activeOption.avatarColor}
        />
      )}
      <div className="flex-1 min-w-[200px]">
        <Dropdown
          size="small"
          placeholder="Probar como…"
          options={options}
          value={activeOption ?? undefined}
          onChange={(option) => option && setActiveUserId((option as UserOption).value)}
          optionRenderer={(option: UserOption) => (
            <div className="flex flex-col">
              <span className="font-semibold">{option.label}</span>
              <span className="text-[11px] text-text-secondary">{option.roleName}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
