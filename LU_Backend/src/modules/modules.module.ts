import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesService } from '../services/modules.service';
import { ModulesController } from '../controllers/modules.controller';
import { Module as ModuleModel, ModuleSchema } from '../schemas/module.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ModuleModel.name, schema: ModuleSchema }])],
  providers: [ModulesService],
  controllers: [ModulesController],
})
export class ModulesModule {}
