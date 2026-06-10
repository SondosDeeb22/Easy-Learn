// =============================================================
//? Import 
// =============================================================

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// =============================================================

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // --------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('APIs Documentation for EasyLearn Web App')
    .setDescription('APIs description')
    .setVersion('1.0')
    .build();

  // swagger setup ------------------------------------
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/apis', app, document);

  await app.listen(process.env.PORT ?? 3000);
}


// =============================================================
bootstrap();
