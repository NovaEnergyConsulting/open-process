import { Model } from 'pinia-orm';
import { Attr, Uid, Str, BelongsTo } from 'pinia-orm/dist/decorators';
import { QTableColumn } from 'quasar';
import ProcessStep from './ProcessStep';

export default class Output extends Model {
  static entity = 'outputs';

  @Uid() id!: string;
  @Attr() processStepId!: string;
  @Str('') name!: string;
  @Str('') type!: string;
  @Str('') description!: string;
  @BelongsTo(() => ProcessStep, 'processStepId') processStep!: ProcessStep;
}

export const OutputTableColumns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left',
    sortable: true
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
    sortable: true
  }
];
