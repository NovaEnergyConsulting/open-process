<template>
  <div class="row">
    <q-input
      v-model="process.name"
      type="text"
      dark
      borderless
      dense
      autogrow
      class="col text-subtitle1"
      @update:model-value="updateProcess"
    />

    <q-space />

    <q-btn
      flat
      color="accent"
      icon="add"
      label="Step"
      @click="emit('addProcessStep')"
    />

    <q-btn flat color="negative" icon="delete" @click="emit('deleteProcess')" />
  </div>
  <q-separator dark style="height: 1px" />
  <TransitionGroup
    :id="`${props.data.id}`"
    tag="ul"
    class="row justify-center"
    name="cards"
    ref="listRef"
    @drop="onDrop"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
  >
    <process-step-card
      :id="`${step.id}`"
      tag="li"
      class="q-ma-sm"
      v-for="step in steps"
      :key="step.id"
      :data="step"
      ref="cardsRef"
      @on-drag-start="onDragStart"
    />
  </TransitionGroup>
  <q-separator dark style="height: 1px" />
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { useRepo } from 'pinia-orm';

import Process from 'src/models/Process';
import ProcessStep from 'src/models/ProcessStep';
import ProcessStepCard from 'src/components/ProcessStepCard.vue';

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<Process>
  }
});

const emit = defineEmits<{
  (event: 'addProcessStep'): void;
  (event: 'deleteProcess'): void;
}>();

const processRepo = useRepo(Process);
const stepsRepo = useRepo(ProcessStep);

const steps = computed(() => stepsRepo.where('processId', props.data.id).get());

const listRef = ref<HTMLUListElement>();
const cardsRef = ref<HTMLElement[]>();
const process = ref<Process>(props.data);

const updateProcess = () => processRepo.save(process.value);

const onDragStart = (evt: DragEvent) => {
  const targetEl = evt.target as HTMLElement;
  evt.dataTransfer?.setData('text', targetEl.id);
};

const onDragEnter = (evt: DragEvent) => {
  const targetEl = evt.target as HTMLElement;
  if (targetEl.draggable !== true) {
    targetEl.classList.add('drag-over');
  }
};

const onDragLeave = (evt: DragEvent) => {
  const targetEl = evt.target as HTMLElement;
  targetEl.classList.remove('drag-over');
};

const onDragOver = (evt: DragEvent) => {
  evt.preventDefault();
};

const onDrop = (evt: DragEvent) => {
  evt.preventDefault();
  const targetEl = evt.target as HTMLElement;
  const targetElId = targetEl.id;

  if (targetEl.draggable === true) return;

  const draggedId: string = evt.dataTransfer?.getData('text') as string;
  const draggedEl = document.getElementById(draggedId) as HTMLElement;

  const currentParentId = (draggedEl.parentNode as HTMLElement).id;

  if (currentParentId !== targetElId) {
    draggedEl.parentNode?.removeChild(draggedEl);
    stepsRepo.save({ id: draggedId, processId: targetElId });
  }

  targetEl.classList.remove('drag-over');
};
</script>

<style scoped lang="scss">
ul,
li {
  margin-left: 0px;
  list-style: none;
}

.cards-move,
.cards-enter-active,
.cards-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.cards-enter-from,
.cards-leave-to {
  opacity: 0;
  transform: scale(0.01);
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.cards-leave-active {
  position: absolute;
}

.drag-over {
  border: 1px dashed $accent;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
