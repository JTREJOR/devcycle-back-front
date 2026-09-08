"use client";

import { Heading, Text } from "@vibe/core";
import { ProjectBoard } from "@/components/ProjectBoard";

export default function PortfolioPage() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Heading type="h1">Portafolio de proyectos</Heading>
        <Text type="text2" color="secondary">
          Descubrimiento, priorización y ejecución del portafolio — datos de ejemplo.
        </Text>
      </div>
      <ProjectBoard />
    </div>
  );
}
