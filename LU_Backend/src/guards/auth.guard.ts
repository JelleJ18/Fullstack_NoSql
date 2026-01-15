import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;
    
    if (!token) {
      throw new UnauthorizedException('Je bent niet ingelogd');
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
