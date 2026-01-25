import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/app/app.module';
// Use require-style imports to avoid ESM/CommonJS interop issues at runtime
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });
  
  // Parse cookies
  app.use(cookieParser());
  
  const mongoUri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/lu_2';
  console.log(`[MongoDB] using ${process.env.MONGO_URI ? 'MONGO_URI env' : 'local fallback'} URI`);
  const sessionSecret = process.env.SESSION_SECRET ?? 'dev-secret-change-me';

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // require https in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // allow cross-site cookies
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
      store: MongoStore.create({ mongoUrl: mongoUri }),
    }),
  );
  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
