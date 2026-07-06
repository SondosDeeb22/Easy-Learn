// =============================================================
//? Import
// =============================================================

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';


import cookieParser from 'cookie-parser';

//interceptors
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';


// =============================================================

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // cookieParser setup ------------------------------------
  app.use(cookieParser());

  //swagger setup --------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('APIs Documentation for EasyLearn Web App')
    .setDescription('APIs description')
    .setVersion('1.0')
    .addServer('/api')
    .build();

  //  -----------
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync(
    './openapi.json',
    JSON.stringify(document, null, 2),
  );
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalInterceptors(new TimeoutInterceptor(5 * 60 * 1000));

  // prefix all routes with /api, so vite proxy forwards all backend requests to /api/...
  app.setGlobalPrefix('api')

  await app.listen(process.env.PORT ?? 3000);

}

// =============================================================
bootstrap();