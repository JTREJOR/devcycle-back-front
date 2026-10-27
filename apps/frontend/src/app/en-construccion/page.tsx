import { Suspense } from "react";
import { UnderConstructionView } from "@/components/UnderConstructionView";

export default function EnConstruccionPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-text-secondary">
          Cargando vista en construcción...
        </div>
      }
    >
      <UnderConstructionView />
    </Suspense>
  );
}
