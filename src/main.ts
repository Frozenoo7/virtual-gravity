import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { ConfigurationService } from 'configuration/configuration.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigurationService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(configService.appPort);
}
bootstrap();
