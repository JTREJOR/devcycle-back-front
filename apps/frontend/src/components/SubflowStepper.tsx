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
    <div className="flex flex-col">
      {substeps.map((subStep, index) => {
        const isDone = isStageActive ? index < currentIndex : false;
        const isCurrent = isStageActive && subStep.id === project.currentSubStepId;

        return (
          <div
            key={subStep.id}
            className="flex gap-3.5 border-b border-border-default py-4"
          >
            <div className="flex w-6 flex-col items-center">
              <span
                className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                  isCurrent
                    ? "border-brand-primary bg-brand-primary"
                    : isDone
                      ? "border-[#00c875] bg-[#00c875]"
                      : "border-[#c5c7d0] bg-bg-card"
                }`}
              />
              {index < substeps.length - 1 && (
                <span className="mt-0.5 w-0.5 flex-1 bg-border-default" />
              )}
            </div>
            <div
              className={`flex-1 pb-1 ${
                isCurrent
                  ? "-mx-4 -mt-2.5 rounded-[10px] bg-brand-primary-light px-4 py-3"
                  : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
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
                <div className="mt-2 flex flex-col gap-1">
                  {subStep.branches.map((branch) => (
                    <div
                      key={`${branch.label}-${branch.text}`}
                      className="text-xs text-text-secondary"
                    >
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
