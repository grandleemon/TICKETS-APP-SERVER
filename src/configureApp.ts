import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

export const configureApp = (app: INestApplication) => {
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
};
