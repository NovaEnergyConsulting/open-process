<template>
  <q-btn-group class="gt-sm">
    <q-btn outline square color="accent" label="Open" @click="openFile()" />
    <q-btn outline square color="accent" label="Save" @click="saveFile()" />
    <q-btn
      color="accent"
      outline
      icon="cleaning_services"
      label="Clear Workspace"
      @click="clearWorkspace()"
    />

    <q-btn
      outline
      color="accent"
      icon="add"
      label="Process"
      @click="emit('addProcess')"
    />
  </q-btn-group>
  <q-btn-dropdown
    flat
    auto-close
    color="accent"
    dropdown-icon="menu"
    class="lt-md"
  >
    <q-list dark class="bg-primary">
      <q-item clickable v-close-popup style="padding: 0px">
        <q-item-section>
          <q-btn
            flat
            padding="10px 24px"
            color="accent"
            label="Open"
            @click="openFile()"
          />
        </q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup style="padding: 0px">
        <q-item-section>
          <q-btn
            flat
            padding="10px 24px"
            color="accent"
            label="Save"
            @click="saveFile()"
          />
        </q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup style="padding: 0px">
        <q-item-section>
          <q-btn
            flat
            padding="10px 24px"
            color="accent"
            label="Clear"
            @click="clearWorkspace()"
          />
        </q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup style="padding: 0px">
        <q-item-section>
          <q-btn
            flat
            padding="10px 24px"
            color="accent"
            label="Add Process"
            @click="emit('addProcess')"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useRepo } from 'pinia-orm';
import { LocalStorage, useQuasar } from 'quasar';
import { onKeyStroke } from '@vueuse/core';

import AppRepository from 'src/models/AppRepository';

const $q = useQuasar();
const appRepo = useRepo(AppRepository);

const emit = defineEmits<{
  (event: 'addProcess'): void;
}>();

onKeyStroke(['s', 'S'], (evt: KeyboardEvent) => {
  if (evt.ctrlKey) {
    evt.preventDefault();
    saveFile();
  }
});

onKeyStroke(['o', 'O'], (evt: KeyboardEvent) => {
  if (evt.ctrlKey) {
    evt.preventDefault();
    openFile();
  }
});

onKeyStroke(['c', 'C'], (evt: KeyboardEvent) => {
  if (evt.ctrlKey && evt.shiftKey) {
    evt.preventDefault();
    clearWorkspace();
  }
});

onKeyStroke(['p', 'P'], (evt: KeyboardEvent) => {
  if (evt.ctrlKey && evt.shiftKey) {
    evt.preventDefault();
    emit('addProcess');
  }
});

const openFile = async () => await appRepo.openFromFile();

const saveFile = async () => {
  if (await appRepo.saveToFile())
    $q.notify({
      type: 'positive',
      message: 'File saved successfully',
      timeout: 2000
    });
};

const clearWorkspace = () => {
  appRepo.clear();
  LocalStorage.clear();
};
</script>
