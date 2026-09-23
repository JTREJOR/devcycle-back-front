"use client";

import { InitiativesSummary } from "@/components/InitiativesSummary";
import { ProjectBoard } from "@/components/ProjectBoard";
import { WelcomeBanner } from "@/components/WelcomeBanner";

export default function PortfolioPage() {
  return (
    <div className="portfolio-page">
      <WelcomeBanner />
      <InitiativesSummary />
      <ProjectBoard />
    </div>
  );
}
