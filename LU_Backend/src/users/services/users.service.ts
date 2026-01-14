import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findAll() {
    return this.userModel.find().lean().exec();
  }

  async findOne(id: string) {
    const doc = await this.userModel.findById(id).lean().exec();
    if (!doc) throw new NotFoundException('User not found');
    return doc;
  }

  async create(data: { username: string; password: string; email?: string }) {
    const hash = await bcrypt.hash(data.password, 12);
    return this.userModel.create({
      username: data.username,
      passwordHash: hash,
      email: data.email,
    });
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
}
