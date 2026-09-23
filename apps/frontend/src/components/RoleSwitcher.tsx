"use client";

import { useMemo } from "react";
import { Avatar, Dropdown } from "@vibe/core";
import { useRoles, useUsers } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";

interface UserOption {
  value: string;
  label: string;
  roleId: string;
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
        roleId: user.roleId,
        roleName: roles.find((r) => r.id === user.roleId)?.name ?? user.roleId,
        avatarColor: user.avatarColor,
      })),
    [users, roles],
  );

  const activeOption = options.find((o) => o.value === activeUserId) ?? null;

  return (
    <div className="role-switcher" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {activeOption && (
        <Avatar
          size="small"
          type="text"
          text={activeOption.label.slice(0, 1)}
          customBackgroundColor={activeOption.avatarColor}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Dropdown
          size="small"
          placeholder="Actuar como…"
          options={options}
          value={activeOption ?? undefined}
          onChange={(option) => option && setActiveUserId((option as UserOption).value)}
          optionRenderer={(option: UserOption) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{option.label}</span>
              <span style={{ fontSize: 11, opacity: 0.65 }}>{option.roleName}</span>
            </div>
          )}
        />
      </div>
      {activeOption && (
        <span className="role-switcher__badge">
          {activeOption.roleId.replace(/-/g, "_").toUpperCase()}
        </span>
      )}
    </div>
  );
}
