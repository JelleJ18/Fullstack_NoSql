import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { UsersService } from './users/services/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; email?: string }) {
    const user = await this.users.create(body);
    return { ok: 1, user };
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }, @Req() req: any) {
    const user = await this.users.findByUsername(body.username);
    if (!user) return { ok: 0, message: 'Invalid credentials' };
    const match = await bcrypt.compare(body.password, (user as any).passwordHash);
    if (!match) return { ok: 0, message: 'Invalid credentials' };
    // store minimal session info
    req.session.userId = (user as any)._id;
    return { ok: 1, user: { _id: (user as any)._id, username: (user as any).username } };
  }

  @Post('logout')
  async logout(@Req() req: any) {
    return new Promise((resolve) => req.session.destroy(() => resolve({ ok: 1 })));
  }

  @Get('me')
  async me(@Req() req: any) {
    if (!req.session?.userId) return { ok: 0 };
    const user = await this.users.findOne(String(req.session.userId));
    return { ok: 1, user };
  }
}
