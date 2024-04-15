import { otelSDK } from './tracer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnprocessableEntityExceptionFilter } from './filters/unprocessable-entity-exception.filter';

async function bootstrap() {
  await otelSDK.start();
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'app',
      port: 4010,
    },
  });

  app.enableCors();

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new UnprocessableEntityExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
    }),
  );

  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('My API Short Link')
    .setDescription('The short link API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
