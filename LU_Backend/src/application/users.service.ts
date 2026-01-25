import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../infrastructure/mongoose/schemas/user.schema';
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
    const user = await this.userModel.create({
      username: data.username,
      passwordHash: hash,
      email: data.email,
      role: 'student',
    });
    return user.toObject();
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUsername(userId: string, newUsername: string) {
    // Check if username is already taken
    const existing = await this.userModel.findOne({ username: newUsername, _id: { $ne: userId } }).exec();
    if (existing) {
      throw new NotFoundException('Gebruikersnaam is al in gebruik');
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    ).exec();

    if (!user) throw new NotFoundException('User not found');
    return user.toObject();
  }

  async enrollModule(userId: string, moduleId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');

    // Check if already enrolled
    if (user.enrolledModules?.includes(moduleId as any)) {
      throw new BadRequestException('Je bent al ingeschreven voor deze module');
    }

    user.enrolledModules?.push(moduleId as any);
    await user.save();
    return user.toObject();
  }

  async unenrollModule(userId: string, moduleId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');

    user.enrolledModules = user.enrolledModules?.filter(m => m.toString() !== moduleId) || [];
    await user.save();
    return user.toObject();
  }

  async getEnrolledModules(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    // Return just the array of ObjectIds - frontend or controller will resolve details
    return user.enrolledModules || [];
  }
}
