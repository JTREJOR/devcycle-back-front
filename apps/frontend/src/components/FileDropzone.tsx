"use client";

import { useEffect, useRef, useState } from "react";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/adapter/drop-target-for-external";
import { containsFiles } from "@atlaskit/pragmatic-drag-and-drop/utils/contains-files";
import { getFiles } from "@atlaskit/pragmatic-drag-and-drop/utils/get-files";
import { Icon, Text } from "@vibe/core";
import { Upload, File as FileIcon } from "@vibe/icons";
import type { Project } from "@devcycle/shared";
import { useAddFile } from "@/lib/queries";
import { formatBytes, formatDate } from "@/lib/format";

export function FileDropzone({ project }: { project: Project }) {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const addFile = useAddFile();

  useEffect(() => {
    const element = zoneRef.current;
    if (!element) return;

    return dropTargetForExternal({
      element,
      canDrop: ({ source }) => containsFiles({ source }),
      onDragEnter: () => setIsActive(true),
      onDragLeave: () => setIsActive(false),
      onDrop: ({ source }) => {
        setIsActive(false);
        const files = getFiles({ source });
        files.forEach((file) => {
          addFile.mutate({ projectId: project.id, name: file.name, size: file.size, type: file.type || "application/octet-stream" });
        });
      },
    });
  }, [project.id, addFile]);

  return (
    <div>
      <div
        ref={zoneRef}
        className={`rounded-xl border-2 border-dashed px-4 py-7 text-center transition-all duration-150 ${
          isActive
            ? "border-brand-primary bg-brand-primary-light"
            : "border-[#c5c7d0] bg-surface-soft"
        }`}
      >
        <Icon icon={Upload} size={28} />
        <div className="mt-2">
          <Text type="text2" weight="bold">
            Arrastra tus documentos de descubrimiento aquí
          </Text>
          <Text type="text3" color="secondary">
            El asistente sugerirá en qué campo del Canvas usarlos
          </Text>
        </div>
      </div>

      {project.documents.length > 0 && (
        <div className="mt-3">
          {project.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-2.5 border-b border-border-default py-2.5"
            >
              <Icon icon={FileIcon} size={20} />
              <div className="flex-1">
                <Text type="text2" weight="bold">
                  {doc.name}
                </Text>
                <Text type="text3" color="secondary">
                  {formatBytes(doc.size)} · {formatDate(doc.uploadedAt)}
                </Text>
                <Text type="text3" color="primary">
                  🤖 {doc.aiInsight}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
