// =============================================================
//? Import
// =============================================================

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//interceptors
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

// =============================================================

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  // --------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('APIs Documentation for EasyLearn Web App')
    .setDescription('APIs description')
    .setVersion('1.0')
    .build();

  // swagger setup ------------------------------------
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/apis', app, document);

  app.useGlobalInterceptors(new TimeoutInterceptor(5 * 60 * 1000));




  await app.listen(process.env.PORT ?? 3000);

}

// =============================================================
bootstrap();