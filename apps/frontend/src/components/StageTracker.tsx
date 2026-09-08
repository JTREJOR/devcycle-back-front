"use client";

import { Icon, Text } from "@vibe/core";
import { Check } from "@vibe/icons";
import type { Stage } from "@devcycle/shared";

interface Props {
  stages: Stage[];
  currentStageId: string;
  selectedStageId: string;
  onSelect: (stageId: string) => void;
}

export function StageTracker({ stages, currentStageId, selectedStageId, onSelect }: Props) {
  const currentOrder = stages.find((s) => s.id === currentStageId)?.order ?? 0;

  return (
    <div className="stage-tracker">
      {stages.map((stage) => {
        const isDone = stage.order < currentOrder;
        const isCurrent = stage.id === currentStageId;
        const isSelected = stage.id === selectedStageId;

        return (
          <button
            key={stage.id}
            className={`stage-pill ${isSelected ? "stage-pill--active" : ""} ${isCurrent ? "stage-pill--current" : ""}`}
            style={
              {
                "--stage-color": stage.color,
                "--stage-color-bg": `${stage.color}1a`,
              } as React.CSSProperties
            }
            onClick={() => onSelect(stage.id)}
          >
            <span className="stage-pill__index">{isDone ? <Icon icon={Check} size={12} /> : stage.order + 1}</span>
            <div>
              <Text type="text2" weight="bold">
                {stage.shortName}
              </Text>
              {isCurrent && (
                <Text type="text3" color="secondary">
                  Etapa actual
                </Text>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
