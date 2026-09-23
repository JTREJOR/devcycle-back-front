import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") {
      next();
      return;
    }

    const route = req.originalUrl || req.url;
    const startedAt = Date.now();
    // eslint-disable-next-line no-console
    console.log(`[INCOMING GET] ${route}`);

    res.on("finish", () => {
      const outcome = res.statusCode >= 400 ? "FAILED" : "COMPLETED";
      const elapsedMs = Date.now() - startedAt;
      // eslint-disable-next-line no-console
      console.log(`[${outcome} GET] ${route} -> ${res.statusCode} (${elapsedMs}ms)`);
    });

    next();
  });

  const allowedOrigins = [
    ...new Set([
      "http://localhost:3002",
      "http://localhost:3000",
      ...(process.env.CORS_ORIGIN ?? "").split(",").map((origin) => origin.trim()),
    ]),
  ].filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  // Start the API on the configured application port.
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`DevCycle backend listening on port ${port}`);
}

bootstrap();
