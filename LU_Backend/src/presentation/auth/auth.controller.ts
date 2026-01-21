import { Controller, Post, Body, Req, Get, Res } from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; email?: string }) {
    const user = await this.users.create(body);
    return { ok: 1, user };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const user = await this.users.findByEmail(body.email);
    if (!user) return res.status(401).json({ ok: 0, message: 'Invalid credentials' });
    const match = await bcrypt.compare(body.password, (user as any).passwordHash);
    if (!match) return res.status(401).json({ ok: 0, message: 'Invalid credentials' });
    
    // Generate JWT token
    const token = jwt.sign({ userId: (user as any)._id, role: (user as any).role }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });
    
    // Set token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.json({ ok: 1, user: { _id: (user as any)._id, username: (user as any).username, role: (user as any).role } });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    console.log('✅ User logged out');
    return res.json({ ok: 1, message: 'Logged out successfully' });
  }

  @Get('me')
  async me(@Req() req: any) {
    const token = req.cookies.token;
    if (!token) {
      console.log('❌ No token found in request');
      return { ok: 0 };
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      const user = await this.users.findOne(decoded.userId);
      console.log('✅ User logged in:', user?.username || user?._id);
      return { ok: 1, user };
    } catch (error) {
      console.log('❌ Token verification failed:', error);
      return { ok: 0, message: 'Invalid token' };
    }
  }
}
