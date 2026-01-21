import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema({ collection: 'vkm_modules', timestamps: true })
export class Module {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  shortdescription?: string;

  @Prop()
  description?: string;

  @Prop()
  content?: string;

  @Prop()
  studycredit?: number;

  @Prop()
  location?: string;

  @Prop()
  contact_id?: number;

  @Prop()
  level?: string;

  @Prop()
  learningoutcomes?: string;

  @Prop({ type: Object })
  colors?: {
    Rood?: number;
    Groen?: number;
    Blauw?: number;
    Geel?: number;
  };

  @Prop({ type: [String] })
  module_tags?: string[];

  @Prop()
  interests_match_score?: number;

  @Prop()
  popularity_score?: number;

  @Prop()
  estimated_difficulty?: number;

  @Prop()
  available_spots?: number;

  @Prop()
  start_date?: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
