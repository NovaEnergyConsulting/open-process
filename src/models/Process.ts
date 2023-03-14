import { Model } from 'pinia-orm';
import { HasMany, Str, Uid } from 'pinia-orm/dist/decorators';
import ProcessStep from './ProcessStep';

export default class Process extends Model {
  static entity = 'processes';

  @Uid() id!: string;
  @Str('Process Name') name!: string;
  @Str('') description!: string;
  @HasMany(() => ProcessStep, 'processId') steps!: ProcessStep[];
}
