import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './services/users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Post()
  create(@Body() body: { username: string; password: string; email?: string }) {
    return this.users.create(body);
  }
}
