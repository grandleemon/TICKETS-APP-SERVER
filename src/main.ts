import 'reflect-metadata';
import { configureApp } from './configureApp';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  await app.listen(process.env.PORT ?? 3000);
  console.log('SERVER RUNNING ON:', process.env.PORT ?? 3000);
}

bootstrap();
