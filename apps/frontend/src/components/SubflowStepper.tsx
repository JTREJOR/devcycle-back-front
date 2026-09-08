"use client";

import { Label, Text } from "@vibe/core";
import type { Project, Stage } from "@devcycle/shared";
import { ApprovalGate } from "./ApprovalGate";
import { DynamicStageForm } from "./DynamicStageForm";

export function SubflowStepper({ project, stage }: { project: Project; stage: Stage }) {
  const substeps = [...stage.substeps].sort((a, b) => a.order - b.order);
  const isStageActive = project.currentStageId === stage.id;
  const currentIndex = substeps.findIndex((s) => s.id === project.currentSubStepId);

  return (
    <div className="substep-list">
      {substeps.map((subStep, index) => {
        const isDone = isStageActive ? index < currentIndex : false;
        const isCurrent = isStageActive && subStep.id === project.currentSubStepId;

        return (
          <div key={subStep.id} className={`substep-item ${isCurrent ? "substep-item--current" : ""}`}>
            <div className="substep-item__rail">
              <span className={`substep-item__dot ${isDone ? "substep-item__dot--done" : ""} ${isCurrent ? "substep-item__dot--current" : ""}`} />
              {index < substeps.length - 1 && <span className="substep-item__line" />}
            </div>
            <div className="substep-item__body">
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Text type="text2" weight="bold">
                  {subStep.order}. {subStep.title}
                </Text>
                <Label text={subStep.responsibleLane} color="american_gray" kind="line" size="small" />
                {subStep.type === "decision" && <Label text="Decisión" color="dark-orange" kind="line" size="small" />}
                {subStep.type === "approval" && <Label text="Aprobación" color="dark-blue" kind="line" size="small" />}
                {isCurrent && <Label text="Paso actual" color="berry" kind="fill" size="small" />}
              </div>
              <Text type="text3" color="secondary">
                {subStep.description}
              </Text>

              {subStep.branches && subStep.branches.length > 0 && (
                <div className="branch-list">
                  {subStep.branches.map((branch) => (
                    <div key={`${branch.label}-${branch.text}`} className="branch-row">
                      <strong>{branch.label}:</strong> {branch.text}
                    </div>
                  ))}
                </div>
              )}

              {subStep.type === "approval" && <ApprovalGate project={project} stage={stage} subStep={subStep} />}

              {subStep.formFields && subStep.formFields.length > 0 && (
                <DynamicStageForm project={project} stage={stage} subStep={subStep} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
