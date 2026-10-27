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
    <div className="flex gap-2.5 overflow-x-auto px-0.5 pt-1 pb-3">
      {stages.map((stage) => {
        const isDone = stage.order < currentOrder;
        const isCurrent = stage.id === currentStageId;
        const isSelected = stage.id === selectedStageId;

        return (
          <button
            key={stage.id}
            type="button"
            className={`flex-[1_1_140px] min-w-[140px] rounded-[10px] border-[1.5px] px-3.5 py-3 text-left shadow-2xs cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
              isSelected
                ? "border-brand-primary ring-1 ring-brand-primary"
                : "border-border-default"
            } ${isCurrent ? "bg-brand-primary-light" : "bg-bg-card"}`}
            onClick={() => onSelect(stage.id)}
          >
            <span className="mb-1.5 inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-primary text-[11px] font-bold text-white">
              {isDone ? <Icon icon={Check} size={12} /> : stage.order + 1}
            </span>
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
