import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RootController } from './root.controller';
import { MongoLoggerProvider } from './mongo-logger.provider';
import { AuthController } from './auth.controller';
import { UsersModule } from './users/users.module';

// Altijd verbinden: gebruik env of val terug op lokale default
const mongoModule = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const envUri = config.get<string>('MONGODB_URI');
    const uri = envUri && envUri.trim().length > 0 ? envUri : 'mongodb://127.0.0.1:27017/lu_2';
    // eslint-disable-next-line no-console
    console.log('[MongoDB] connecting to:', uri);
    // store for status debugging
    process.env.EFFECTIVE_MONGODB_URI = uri;
    return {
      uri,
      serverSelectionTimeoutMS: 10000,
      // deze twee hints lossen vaak localhost/IPv6 issues op
      directConnection: true as any,
      family: 4 as any,
      // Retry & logging to diagnose connection issues
      retryAttempts: 5,
      retryDelay: 2000,
      verboseRetryLog: true,
      connectionErrorFactory: (error: any) => {
        // eslint-disable-next-line no-console
        console.error('[MongoDB] connection error:', error?.message ?? error);
        process.env.MONGOOSE_LAST_ERROR_MSG = String(error?.message ?? error);
        return error;
      },
    } as any;
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    mongoModule,
    UsersModule,
  ],
  controllers: [AppController, RootController, AuthController],
  providers: [AppService, MongoLoggerProvider],
})
export class AppModule {}
