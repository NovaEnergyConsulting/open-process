<template>
  <q-card
    ref="cardRef"
    :tag="toggle ? 'div' : props.tag"
    v-bind="cardProps"
    @dragstart="cardDragged"
  >
    <q-card-section class="col-1" @click="onCardClicked">
      <div class="row items-center no-wrap">
        <div class="col">
          <q-input
            v-if="toggle"
            borderless
            class="text-h6"
            v-model="processStep.name"
            type="text"
            @update:model-value="updateProcessStep"
          />
          <div
            v-else
            class="text-h6 non-selectable cursor-pointer ellipsis"
            style="max-width: 10em"
          >
            {{ props.data?.name }}
          </div>
        </div>
        <q-space />
        <q-btn
          v-if="toggle"
          flat
          round
          icon="close"
          @click.stop="onCloseCardClicked"
        />
      </div>
    </q-card-section>
    <q-card-section
      :class="toggle ? 'col-4' : 'col q-pb-none'"
      @click="onCardClicked"
    >
      <q-editor
        v-if="toggle"
        v-model="processStep.description"
        max-height="6rem"
        lang="en"
        @update:model-value="updateProcessStep"
      />
      <div
        v-else
        class="cursor-pointer non-selectable ellipsis-3-lines"
        style="max-width: 300px"
        v-html="props.data?.description"
      ></div>
    </q-card-section>
    <q-card-section v-if="toggle" class="col-6">
      <div class="row q-gutter-sm">
        <div class="col">
          <q-table
            dense
            title="Inputs"
            :rows="inputs"
            :columns="inputTableColumns"
            row-key="id"
          >
            <template v-slot:top-right>
              <q-btn
                dense
                flat
                size="sm"
                color="primary"
                icon="add"
                @click="addInput"
              />
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.field" :props="props">
                  <q-input
                    v-model="inputsEntry[props.rowIndex][col.field]"
                    dense
                    borderless
                    hide-bottom-space
                    input-class="text-left"
                    @change="updateInput(inputsEntry[props.rowIndex] as Input)"
                  />
                </q-td>
                <q-td auto-width>
                  <q-btn
                    dense
                    flat
                    size="sm"
                    color="negative"
                    icon="delete"
                    @click="deleteInput(inputsEntry[props.rowIndex] as Input)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="col">
          <q-table
            dense
            title="Outputs"
            :rows="outputs"
            :columns="outputTableColumns"
            row-key="id"
          >
            <template v-slot:top-right>
              <q-btn
                dense
                flat
                size="sm"
                color="primary"
                icon="add"
                @click="addOutput"
              />
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.field" :props="props">
                  <q-input
                    v-model="outputsEntry[props.rowIndex][col.field]"
                    dense
                    borderless
                    hide-bottom-space
                    input-class="text-left"
                    @change="
                      updateOutput(outputsEntry[props.rowIndex] as Output)
                    "
                  />
                </q-td>
                <q-td auto-width>
                  <q-btn
                    dense
                    flat
                    size="sm"
                    color="negative"
                    icon="delete"
                    @click="
                      deleteOutput(outputsEntry[props.rowIndex] as Output)
                    "
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right" :class="toggle ? 'col-1' : 'col-3'">
      <q-btn
        flat
        :size="toggle ? 'md' : 'sm'"
        icon="delete"
        color="negative"
        @click="deleteProcessStep(props.data.id)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { morph, QCard } from 'quasar';
import { useRepo } from 'pinia-orm';

import ProcessStep from 'src/models/ProcessStep';
import Input, { InputTableColumns } from 'src/models/Input';
import Output, { OutputTableColumns } from 'src/models/Output';

const stepsRepo = useRepo(ProcessStep);
const inputsRepo = useRepo(Input);
const outputsRepo = useRepo(Output);

const props = defineProps({
  data: { required: true, type: Object as PropType<ProcessStep> },
  tag: String
});

const emit = defineEmits<{
  (event: 'cardClicked'): void;
  (event: 'onDragStart', evt: DragEvent): void;
}>();

const inputs = computed(() =>
  inputsRepo.where('processStepId', props.data.id).get()
);

const inputsEntry = ref<Input[]>(
  inputsRepo.where('processStepId', props.data.id).get()
);

const inputTableColumns = InputTableColumns;

const outputs = computed(() =>
  outputsRepo.where('processStepId', props.data.id).get()
);

const outputsEntry = ref<Output[]>(
  outputsRepo.where('processStepId', props.data.id).get()
);

const outputTableColumns = OutputTableColumns;

const processStep = ref<ProcessStep>(props.data);
const cardRef = ref<QCard>();
const toggle = ref(false);

const cardProps = computed(() => {
  return toggle.value === true
    ? {
        class: 'fullscreen q-ma-md z-top column'
      }
    : {
        class: 'hoverable-card column',
        draggable: true
      };
});

const deleteProcessStep = (id: string) => stepsRepo.destroy(id);
const updateProcessStep = () => stepsRepo.save(processStep.value);

const addInput = () => {
  const input = inputsRepo.insert({ processStepId: props.data.id });
  inputsEntry.value.push(input);
};
const updateInput = (value: Input) => inputsRepo.save(value);
const deleteInput = (value: Input) => {
  const index = inputsEntry.value.findIndex((inp) => inp.id == value.id);
  inputsEntry.value.splice(index, 1);
  inputsRepo.destroy(value.id);
};

const addOutput = () => {
  const output = outputsRepo.insert({ processStepId: props.data.id });
  outputsEntry.value.push(output);
};
const updateOutput = (value: Output) => outputsRepo.save(value);
const deleteOutput = (value: Output) => {
  const index = outputsEntry.value.findIndex((inp) => inp.id == value.id);
  outputsEntry.value.splice(index, 1);
  outputsRepo.destroy(value.id);
};

const cardDragged = (evt: DragEvent) => {
  emit('onDragStart', evt);
};

const onCloseCardClicked = () => {
  morphCard();
  emit('cardClicked');
};

const onCardClicked = () => {
  if (!toggle.value) {
    morphCard();
    emit('cardClicked');
  }
};

let cancel: () => boolean | undefined;

const morphCard = () => {
  const onToggle = () => {
    toggle.value = toggle.value !== true;
  };

  if (cancel === void 0 || cancel() === false) {
    cancel = morph({
      from: cardRef.value?.$el,
      onToggle,
      duration: 500,
      tween: true,
      onEnd: (end) => {
        end === 'from' && onToggle();
      }
    });
  }
};
</script>

<style scoped lang="scss">
.hoverable-card {
  box-shadow: none;
  transition: all 0.2s ease-in-out;
}
.hoverable-card:hover {
  translate: 0px -5px;
  box-shadow: 0px 5px 20px $secondary;
}
</style>
