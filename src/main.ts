import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { LoggingInterceptor } from './common/logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // whitelist: drop fields that are not in the DTO (e.g. someone sending "id")
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // Hides fields marked @Exclude() (the user's passwordHash)
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
