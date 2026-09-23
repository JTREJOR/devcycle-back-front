"use client";

import { useEffect, useMemo, useState } from "react";
import { Sun } from "@vibe/icons";
import { useUsers } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";

function titleCase(value: string) {
  return value
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function WelcomeBanner() {
  const { data: users = [] } = useUsers();
  const activeUserId = useUiStore((state) => state.activeUserId);
  const user = users.find((item) => item.id === activeUserId);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedDate = useMemo(
    () =>
      titleCase(
        new Intl.DateTimeFormat("es-MX", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(now),
      ),
    [now],
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat("es-MX", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now),
    [now],
  );

  return (
    <section className="portfolio-card welcome-banner">
      <div>
        <h1 className="welcome-banner__title">
          ¡Buenos días{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="welcome-banner__subtitle">
          Consulta el estado de tus iniciativas, aprobaciones y solicitudes del portafolio.
        </p>
      </div>
      <div className="welcome-banner__datetime">
        <div className="welcome-banner__sun" aria-hidden>
          <Sun size={24} />
        </div>
        <div>
          <time className="welcome-banner__time" dateTime={now.toISOString()}>
            {formattedTime}
          </time>
          <div className="welcome-banner__date">{formattedDate}</div>
        </div>
      </div>
    </section>
  );
}
