<template>
  <div class="fit column q-mx-md">
    <div class="col" v-for="lane in processLanes" :key="lane.id">
      <process-lane
        :data="lane"
        @add-process-step="addProcessStep(lane.id)"
        @delete-process="deleteProcess(lane.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRepo } from 'pinia-orm';

import Process from 'src/models/Process';
import ProcessLane from './ProcessLane.vue';
import ProcessStep from 'src/models/ProcessStep';

const processRepo = useRepo(Process);
const processStepsRepo = useRepo(ProcessStep);

const processLanes = computed(() => processRepo.all());

const addProcessStep = (processId: string) =>
  processStepsRepo.insert({ processId: processId });

const deleteProcess = (id: string) => {
  processStepsRepo.where('processId', id).delete();
  processRepo.destroy(id);
};
</script>
