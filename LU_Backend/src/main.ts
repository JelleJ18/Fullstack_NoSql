import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Use require-style imports to avoid ESM/CommonJS interop issues at runtime
const session = require('express-session');
const MongoStore = require('connect-mongo');
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/lu_2';
  const sessionSecret = process.env.SESSION_SECRET ?? 'dev-secret-change-me';

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
      store: MongoStore.create({ mongoUrl: mongoUri }),
    }),
  );
  await app.listen(4000);
}
bootstrap();
