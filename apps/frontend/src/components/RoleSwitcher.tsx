"use client";

import { Avatar } from "@vibe/core";
import { useUsers } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";

export function RoleSwitcher() {
  const { data: users = [] } = useUsers();
  const activeUserId = useUiStore((s) => s.activeUserId);

  const activeUser = users.find((u) => u.id === activeUserId) ?? null;

  return (
    <div className="flex items-center gap-2">
      {activeUser && (
        <Avatar
          size="small"
          type="text"
          text={activeUser.name.slice(0, 1)}
          customBackgroundColor={activeUser.avatarColor}
        />
      )}
      <span className="text-[13.5px] font-semibold text-text-main">
        {activeUser ? activeUser.name : "Mariana Solís"}
      </span>
    </div>
  );
}
