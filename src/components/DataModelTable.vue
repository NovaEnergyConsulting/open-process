<template>
  <q-table
    dense
    :title="props.title"
    :rows="props.rows"
    :columns="props.cols"
    :row-key="props.rowKey"
  >
    <template v-slot:top-right>
      <q-btn
        dense
        flat
        size="sm"
        color="primary"
        icon="add"
        @click="emit('addRow')"
      />
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <q-input
            :model-value="modelValue[props.rowIndex][col.field]"
            @update:model-value="emit('update:modelValue')"
            dense
            borderless
            hide-bottom-space
            input-class="text-left"
            @change="emit('inputChanged')"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';

const emit = defineEmits<{
  (event: 'addRow'): void;
  (event: 'inputChanged'): void;
  (event: 'update:modelValue'): void;
}>();

const props = defineProps({
  title: String,
  rowKey: String,
  modelValue: {
    type: Array<Array<string | number | null | undefined>>,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  cols: {
    type: Array<QTableColumn>,
    required: true
  }
});
</script>
