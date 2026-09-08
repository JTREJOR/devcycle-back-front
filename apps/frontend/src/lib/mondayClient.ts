"use client";

import { useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";

export interface MondayContext {
  isEmbedded: boolean;
  user: string;
  account: string;
  theme: "light" | "dark";
}

const MOCK_CONTEXT: MondayContext = {
  isEmbedded: false,
  user: "Demo (fuera de Monday)",
  account: "DevCycle Demo",
  theme: "light",
};

let mondayInstance: ReturnType<typeof mondaySdk> | null = null;

export function getMonday() {
  if (typeof window === "undefined") return null;
  if (!mondayInstance) {
    mondayInstance = mondaySdk();
  }
  return mondayInstance;
}

/**
 * Intenta leer el contexto real del iframe de Monday; si no responde en 800ms
 * (porque la app corre standalone, fuera de Monday) cae a un contexto mock.
 */
async function resolveContext(): Promise<MondayContext> {
  const monday = getMonday();
  if (!monday) return MOCK_CONTEXT;

  const timeout = new Promise<MondayContext>((resolve) =>
    setTimeout(() => resolve(MOCK_CONTEXT), 800),
  );

  const real = monday
    .get("context")
    .then((res: any) => {
      const data = res?.data ?? {};
      return {
        isEmbedded: true,
        user: data.user?.name ?? "Usuario de Monday",
        account: data.account?.name ?? "Cuenta de Monday",
        theme: data.theme === "dark" ? "dark" : "light",
      } as MondayContext;
    })
    .catch(() => MOCK_CONTEXT);

  return Promise.race([real, timeout]);
}

export function useMondayContext() {
  const [context, setContext] = useState<MondayContext>(MOCK_CONTEXT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    resolveContext().then((ctx) => {
      if (mounted) {
        setContext(ctx);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { context, loading };
}
