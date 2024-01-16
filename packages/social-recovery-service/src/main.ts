import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const APP_PORT = new ConfigService().get('SOCIAL_RECOVERY_SERVICE_PORT');
  const app = await NestFactory.create(AppModule);
  await app.listen(APP_PORT);
}
bootstrap();
