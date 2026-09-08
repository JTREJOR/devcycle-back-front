"use client";

import { useState } from "react";
import { Button, TextArea } from "@vibe/core";
import { ThumbsDown, ThumbsUp } from "@vibe/icons";
import type { Project, Stage, SubStep } from "@devcycle/shared";
import { useRoles, useUsers, useAddApproval } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";
import { RoleTag } from "./RoleTag";
import { formatDate } from "@/lib/format";

export function ApprovalGate({ project, stage, subStep }: { project: Project; stage: Stage; subStep: SubStep }) {
  const { data: users = [] } = useUsers();
  const { data: roles = [] } = useRoles();
  const activeUserId = useUiStore((s) => s.activeUserId);
  const addApproval = useAddApproval();
  const [comment, setComment] = useState("");

  const activeUser = users.find((u) => u.id === activeUserId);
  const approverRole = roles.find((r) => r.id === subStep.approverRoleId);
  const canApprove = activeUser?.roleId === subStep.approverRoleId;

  const existingApproval = project.approvals
    .filter((a) => a.subStepId === subStep.id)
    .sort((a, b) => (a.ts < b.ts ? 1 : -1))[0];

  const isCurrentSubStep = project.currentSubStepId === subStep.id && project.currentStageId === stage.id;

  function decide(decision: "aprobado" | "rechazado") {
    if (!activeUser || !approverRole) return;
    addApproval.mutate({
      projectId: project.id,
      subStepId: subStep.id,
      roleId: approverRole.id,
      userId: activeUser.id,
      decision,
      comment: comment.trim() || undefined,
    });
    setComment("");
  }

  return (
    <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: "#fbfbfd", border: "1px solid var(--ui-border-color, #e6e9ef)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "#676879" }}>Requiere aprobación de:</span>
        {approverRole && <RoleTag roleId={approverRole.id} roleName={approverRole.name} />}
      </div>

      {existingApproval && (
        <div style={{ fontSize: 12, marginBottom: 8, color: existingApproval.decision === "aprobado" ? "#00854d" : "#c92929" }}>
          {existingApproval.decision === "aprobado" ? "Aprobado" : "Rechazado"} el {formatDate(existingApproval.ts)}
          {existingApproval.comment ? ` — "${existingApproval.comment}"` : ""}
        </div>
      )}

      {isCurrentSubStep ? (
        canApprove ? (
          <>
            <TextArea
              placeholder="Comentario (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Button
                size="small"
                color="positive"
                leftIcon={ThumbsUp}
                loading={addApproval.isPending}
                onClick={() => decide("aprobado")}
              >
                Aprobar
              </Button>
              <Button
                size="small"
                kind="secondary"
                color="negative"
                leftIcon={ThumbsDown}
                loading={addApproval.isPending}
                onClick={() => decide("rechazado")}
              >
                Rechazar
              </Button>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: "#9699a6" }}>
            Actúas como <strong>{activeUser?.name}</strong> ({roles.find((r) => r.id === activeUser?.roleId)?.name}).
            Cambia el rol activo en el encabezado a <strong>{approverRole?.name}</strong> para aprobar este paso.
          </div>
        )
      ) : null}
    </div>
  );
}
