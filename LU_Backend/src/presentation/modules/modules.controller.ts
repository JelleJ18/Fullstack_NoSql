import { Controller, Get, Param } from '@nestjs/common';
import { ModulesService } from '../../application/modules.service';

@Controller('api/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  list() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }
}
