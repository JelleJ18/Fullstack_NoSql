import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { AuthGuard } from '../../infrastructure/auth/guards/auth.guard';
import { RoleGuard } from '../../infrastructure/auth/guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';

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
