import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../../application/users.service';
import { UsersController } from '../users/users.controller';
import { User, UserSchema } from '../../infrastructure/mongoose/schemas/user.schema';
import { AuthGuard } from '../../infrastructure/auth/guards/auth.guard';
import { RoleGuard } from '../../infrastructure/auth/guards/role.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, RoleGuard],
  exports: [UsersService],
})
export class UsersModule {}
