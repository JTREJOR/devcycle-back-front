import { Suspense } from "react";
import { UnderConstructionView } from "@/components/UnderConstructionView";

export default function NotFoundPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: "center" }}>Cargando vista en construcción...</div>
      }
    >
      <UnderConstructionView />
    </Suspense>
  );
}
