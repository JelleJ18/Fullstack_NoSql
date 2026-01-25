import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, Delete } from '@nestjs/common';
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

  @Patch('me/username')
  @UseGuards(AuthGuard)
  async updateMyUsername(@Req() req: any, @Body() body: { username: string }) {
    const userId = req.user.userId; 
    console.log('[UPDATE USERNAME] userId from JWT:', userId, 'new username:', body.username);
    const updatedUser = await this.users.updateUsername(userId, body.username);
    return { message: 'Gebruikersnaam succesvol gewijzigd', user: { username: updatedUser.username } };
  }
  @Post('me/modules/:moduleId')
  @UseGuards(AuthGuard)
  async enrollModule(@Req() req: any, @Param('moduleId') moduleId: string) {
    const userId = req.user.userId;
    const user = await this.users.enrollModule(userId, moduleId);
    return { message: 'Succesvol ingeschreven!', enrolledModules: user.enrolledModules };
  }

  @Delete('me/modules/:moduleId')
  @UseGuards(AuthGuard)
  async unenrollModule(@Req() req: any, @Param('moduleId') moduleId: string) {
    const userId = req.user.userId;
    const user = await this.users.unenrollModule(userId, moduleId);
    return { message: 'Uitgeschreven!', enrolledModules: user.enrolledModules };
  }

  @Get('me/modules')
  @UseGuards(AuthGuard)
  async getMyEnrolledModules(@Req() req: any) {
    const userId = req.user.userId;
    const modules = await this.users.getEnrolledModules(userId);
    return modules;
  }}
