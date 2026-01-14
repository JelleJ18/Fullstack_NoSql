import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly conn: Connection,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  getDbStatus() {
    const states: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    };
    const readyState = (this.conn as any)?.readyState as 0 | 1 | 2 | 3 | 99;
    return {
      state: states[readyState] ?? `unknown(${readyState})`,
      readyState,
      host: (this.conn as any)?.host,
      name: (this.conn as any)?.name,
      effectiveUri: process.env.EFFECTIVE_MONGODB_URI,
      lastError: process.env.MONGOOSE_LAST_ERROR_MSG,
    };
  }

  @Get('db-ping')
  async pingDb() {
    try {
      // Use the native driver via Nest-managed mongoose connection
      const admin = (this.conn as any)?.db?.admin?.();
      if (!admin) {
        return { ok: 0, error: 'No active connection (admin unavailable)' };
      }
      const result = await admin.command({ ping: 1 });
      return { ok: 1, result };
    } catch (err: any) {
      return { ok: 0, error: err?.message ?? String(err) };
    }
  }
}
