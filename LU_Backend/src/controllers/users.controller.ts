import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  list() {
    return this.users.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  get(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Post()
  create(@Body() body: { username: string; password: string; email?: string }) {
    return this.users.create(body);
  }
}
