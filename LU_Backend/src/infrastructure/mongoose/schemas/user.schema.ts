import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, unique: true})
  email?: string;

  @Prop({ default: 'student' })
  role?: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  enrolledModules?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
