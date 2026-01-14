import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Injectable()
export class MongoLoggerProvider implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    // Log basis connectie-events
    this.connection.on('connected', () => {
      // eslint-disable-next-line no-console
      console.log('[MongoDB] connected');
    });
    this.connection.on('disconnected', () => {
      // eslint-disable-next-line no-console
      console.warn('[MongoDB] disconnected');
    });
    this.connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('[MongoDB] error:', err?.message ?? err);
    });
  }
}
