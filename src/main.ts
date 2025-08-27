import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { TEnvService } from './modules/env/services/env.service';
import { AllExceptionsFilter } from './@shared/filters/exceptions.filter';
import { CustomLogger } from './@shared/classes/custom-logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const envService = app.get(TEnvService);
  const isDev = envService.get('INFRA_ENVIRONMENT') === 'development';
  const logger = new CustomLogger(envService, 'Bootstrap');

  app.set('trust proxy', 'loopback');
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  /// //////////////////////////
  //  Add prefix to all routes
  /// //////////////////////////
  app.setGlobalPrefix('api');

  /// //////////////////////////
  //  Global exceptions handler
  /// //////////////////////////
  app.useGlobalFilters(new AllExceptionsFilter(new CustomLogger(envService)));

  /// //////////////////////////
  //  Add version to all routes
  /// //////////////////////////
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  /// //////////////////////////
  //  Swagger
  /// //////////////////////////
  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('TIA Demo API')
      .setDescription('TIA Demo API API description')
      .setVersion('1.0')
      .addTag('TIA Demo API')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/swagger', app, documentFactory);
  }

  /// //////////////////////////
  //  Start server
  /// //////////////////////////
  await app.listen(envService.get('INFRA_PORT'));

  logger.log(`Backend is running on port ${envService.get('INFRA_PORT')}`);

  if (isDev) {
    logger.log(
      `Swagger is running on ${envService.get('INFRA_URL')}:${envService.get('INFRA_PORT')}/api/swagger`,
    );
  }
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
bootstrap();
