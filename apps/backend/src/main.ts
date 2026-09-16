import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(",");
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
