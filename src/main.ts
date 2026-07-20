import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não estão no DTO
      forbidNonWhitelisted: true, // rejeita requisição se vier campo extra
      transform: true, // converte tipos automaticamente (string -> number, etc.)
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();