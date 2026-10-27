"use client";

import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@vibe/core";
import { NavigationChevronLeft } from "@vibe/icons";

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
}

export function BackButton({ label = "Atrás", fallbackHref = "/" }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (pathname !== fallbackHref) {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-[5px] rounded-lg border border-border-default bg-bg-card px-3 py-1.5 text-[12.5px] font-bold text-brand-primary shadow-2xs cursor-pointer transition-all duration-150 hover:bg-brand-primary-light hover:border-brand-primary"
      title="Volver a la página anterior"
    >
      <Icon icon={NavigationChevronLeft} size={16} />
      <span>{label}</span>
    </button>
  );
}
