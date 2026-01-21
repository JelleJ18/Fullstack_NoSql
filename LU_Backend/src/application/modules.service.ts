import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../infrastructure/mongoose/schemas/module.schema';

@Injectable()
export class ModulesService {
  constructor(@InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>) {}

  findAll() {
    return this.moduleModel.find().lean().exec();
  }

  async findOne(id: string) {
    const doc = await this.moduleModel.findById(id).lean().exec();
    if (!doc) throw new NotFoundException('Module not found');
    return doc;
  }
}
