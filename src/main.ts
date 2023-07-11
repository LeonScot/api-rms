import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cors()); // Enable CORS for all routes

  // Additional configurations, middleware, etc.

  await app.listen(process.env.PORT || 8000);
  return app; // Return the application instance
}
bootstrap();
export default bootstrap;
