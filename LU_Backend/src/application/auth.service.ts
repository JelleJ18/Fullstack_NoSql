// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../infrastructure/mongoose/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private readonly saltRounds = 12;

  async register(username: string, password: string) {
    const existing = await this.userModel.findOne({ username });
    if (existing) throw new UnauthorizedException('Gebruiker bestaat al');

    const hash = await bcrypt.hash(password, this.saltRounds);

    const user = new this.userModel({
      username,
      passwordHash: hash,
    });

    await user.save();
    return { message: 'Gebruiker aangemaakt' };
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new UnauthorizedException('Ongeldige inlog');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Ongeldige inlog');

    // Hier kun je JWT token genereren:
    return { message: 'Login gelukt' };
  }
}
