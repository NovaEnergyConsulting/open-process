import { Model } from 'pinia-orm';
import { Attr, BelongsTo, HasMany, Str, Uid } from 'pinia-orm/dist/decorators';
import Input from './Input';
import Output from './Output';
import Process from './Process';

export default class ProcessStep extends Model {
  static entity = 'processSteps';

  @Uid() id!: string;
  @Attr() processId!: string;
  @Str('Step Name') name!: string;
  @Str('Step Description') description!: string;
  @BelongsTo(() => Process, 'processId') process!: Process;
  @HasMany(() => Input, 'processStepId') inputs!: Input[];
  @HasMany(() => Output, 'processStepId') outputs!: Output[];
}
