<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-img src="favicon.png" height="25px" width="25px" />

        <q-toolbar-title>OpenProcess</q-toolbar-title>

        <app-toolbar @add-process="addProcess" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRepo } from 'pinia-orm';

import Process from 'src/models/Process';
import AppToolbar from 'src/components/AppToolbar.vue';

const processRepo = useRepo(Process);
const addProcess = () => processRepo.new();
</script>

<style scoped>
.btn-dropdown-list {
  padding: 0;
}
</style>
