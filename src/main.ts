import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redis = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
      },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
