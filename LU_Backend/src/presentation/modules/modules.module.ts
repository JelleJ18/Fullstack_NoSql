import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesService } from '../../application/modules.service';
import { ModulesController } from '../modules/modules.controller';
import { Module as ModuleModel, ModuleSchema } from '../../infrastructure/mongoose/schemas/module.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ModuleModel.name, schema: ModuleSchema }])],
  providers: [ModulesService],
  controllers: [ModulesController],
})
export class ModulesModule {}
